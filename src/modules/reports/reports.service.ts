import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { RevenueReportItemDto } from './dto/revenue-report.dto';
import { OrdersReportItemDto } from './dto/orders-report.dto';
import { InventoryReportItemDto } from './dto/inventory-report.dto';
import { TopCustomerDto } from './dto/top-customer.dto';
import { TopProductDto } from '../dashboard/dto/responses/top-product.dto';
import { DashboardService } from '../dashboard/dashboard.service';

type GroupBy = 'day' | 'week' | 'month' | 'year';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,

    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,

    private readonly dashboardService: DashboardService,
  ) {}

  private getDateRange(from?: string, to?: string) {
    const end = to ? new Date(to) : new Date();
    const start = from ? new Date(from) : new Date(end.getFullYear(), 0, 1);
    // include entire end day
    const endInclusive = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate() + 1,
    );
    return { start, end: endInclusive };
  }

  async getRevenueReport(
    groupBy: GroupBy,
    from?: string,
    to?: string,
  ): Promise<RevenueReportItemDto[]> {
    const { start, end } = this.getDateRange(from, to);

    let dateExpr = 'DATE(o.order_date)';
    if (groupBy === 'month') {
      dateExpr = "DATE_FORMAT(o.order_date, '%Y-%m-01')";
    } else if (groupBy === 'year') {
      dateExpr = "DATE_FORMAT(o.order_date, '%Y-01-01')";
    }

    const raw = await this.orderRepo
      .createQueryBuilder('o')
      .select(`${dateExpr}`, 'period')
      .addSelect('COUNT(*)', 'orders')
      .addSelect(
        'COALESCE(SUM(CAST(o.totalAmount AS DECIMAL)), 0)',
        'revenue',
      )
      .where('o.order_date BETWEEN :start AND :end', { start, end })
      .groupBy('period')
      .orderBy('period', 'ASC')
      .getRawMany();

    return raw.map((r) => ({
      period: r.period,
      orders: Number(r.orders) || 0,
      revenue: Number(r.revenue) || 0,
    }));
  }

  async getOrdersReport(
    from?: string,
    to?: string,
  ): Promise<OrdersReportItemDto[]> {
    const { start, end } = this.getDateRange(from, to);

    const raw = await this.orderRepo
      .createQueryBuilder('o')
      .select('DATE(o.order_date)', 'date')
      .addSelect('COUNT(*)', 'total')
      .addSelect(
        "SUM(CASE WHEN o.status = 'Pending' THEN 1 ELSE 0 END)",
        'pending',
      )
      .addSelect(
        "SUM(CASE WHEN o.status = 'Paid' THEN 1 ELSE 0 END)",
        'paid',
      )
      .addSelect(
        "SUM(CASE WHEN o.status = 'Shipped' THEN 1 ELSE 0 END)",
        'shipped',
      )
      .addSelect(
        "SUM(CASE WHEN o.status = 'Canceled' THEN 1 ELSE 0 END)",
        'canceled',
      )
      .where('o.order_date BETWEEN :start AND :end', { start, end })
      .groupBy('DATE(o.order_date)')
      .orderBy('DATE(o.order_date)', 'ASC')
      .getRawMany();

    return raw.map((r) => ({
      date: r.date,
      totalOrders: Number(r.total) || 0,
      pending: Number(r.pending) || 0,
      paid: Number(r.paid) || 0,
      shipped: Number(r.shipped) || 0,
      canceled: Number(r.canceled) || 0,
    }));
  }

  async getInventoryReport(): Promise<InventoryReportItemDto[]> {
    const rows = await this.inventoryRepo.find({
      relations: ['product', 'category'],
    });

    return rows.map((row) => {
      const available = row.quantity - row.reserved;
      const min = row.min_stock || 0;
      return {
        productId: row.product?.id ?? 0,
        productName: row.product?.name ?? 'Unknown',
        categoryName: row.category?.name ?? null,
        quantity: row.quantity,
        reserved: row.reserved,
        available,
        minStock: min,
        belowMin: min > 0 && available < min,
      };
    });
  }

  async getTopProducts(limit = 5): Promise<TopProductDto[]> {
    return this.dashboardService.getTopProducts(limit);
  }

  async getTopCustomers(limit = 5): Promise<TopCustomerDto[]> {
    const raw = await this.orderRepo
      .createQueryBuilder('o')
      .select('o.customerId', 'customerId')
      .addSelect('COUNT(*)', 'orders')
      .addSelect(
        'COALESCE(SUM(CAST(o.totalAmount AS DECIMAL)), 0)',
        'amount',
      )
      .where('o.customerId IS NOT NULL')
      .groupBy('o.customerId')
      .orderBy('amount', 'DESC')
      .limit(limit)
      .getRawMany();

    const ids = raw.map((r) => r.customerId).filter(Boolean);
    if (!ids.length) return [];

    const customers = await this.customerRepo.findByIds(ids);
    const map = new Map<number, Customer>();
    customers.forEach((c) => map.set(c.id, c));

    return raw
      .map((r) => {
        const c = map.get(Number(r.customerId));
        if (!c) return null;
        return {
          id: c.id,
          name: c.name,
          email: c.email,
          totalOrders: Number(r.orders) || 0,
          totalAmount: Number(r.amount) || 0,
        } as TopCustomerDto;
      })
      .filter(Boolean) as TopCustomerDto[];
  }

  async getTrends(days = 30) {
    // reuse dashboard sales-chart for business trend
    return this.dashboardService.getSalesChart(days);
  }

  // Simple CSV export for revenue and orders
  async exportCsv(
    type: 'revenue' | 'orders' | 'inventory',
    params: { groupBy?: GroupBy; from?: string; to?: string },
  ): Promise<{ filename: string; content: string }> {
    if (type === 'revenue') {
      const data = await this.getRevenueReport(
        params.groupBy || 'day',
        params.from,
        params.to,
      );
      const header = 'period,orders,revenue';
      const rows = data.map(
        (r) => `${r.period},${r.orders},${r.revenue}`,
      );
      return {
        filename: 'revenue-report.csv',
        content: [header, ...rows].join('\n'),
      };
    }

    if (type === 'orders') {
      const data = await this.getOrdersReport(params.from, params.to);
      const header = 'date,totalOrders,pending,paid,shipped,canceled';
      const rows = data.map(
        (r) =>
          `${r.date},${r.totalOrders},${r.pending},${r.paid},${r.shipped},${r.canceled}`,
      );
      return {
        filename: 'orders-report.csv',
        content: [header, ...rows].join('\n'),
      };
    }

    // inventory
    const data = await this.getInventoryReport();
    const header =
      'productId,productName,categoryName,quantity,reserved,available,minStock,belowMin';
    const rows = data.map(
      (r) =>
        `${r.productId},"${r.productName.replace(/"/g, '""')}",${
          r.categoryName ? `"${r.categoryName.replace(/"/g, '""')}"` : ''
        },${r.quantity},${r.reserved},${r.available},${r.minStock},${
          r.belowMin ? '1' : '0'
        }`,
    );
    return {
      filename: 'inventory-report.csv',
      content: [header, ...rows].join('\n'),
    };
  }
}


