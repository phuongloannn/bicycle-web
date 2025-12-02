import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { DashboardStatsDto } from './dto/responses/dashboard-stats.dto';
import { SalesChartDto } from './dto/responses/sales-chart.dto';
import { TopProductDto } from './dto/responses/top-product.dto';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Payment } from '../payment/entities/payment.entity';
import { log } from 'console';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,

    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async getDashboardStats(): Promise<
    DashboardStatsDto & {
      productsGrowth: number;
      ordersGrowth: number;
      revenueGrowth: number;
      customersGrowth: number;
    }
  > {
    const [totalProducts, lowStockProducts] = await Promise.all([
      this.productRepository.count(),
      this.productRepository.count({ where: { quantity: LessThan(10) } }),
    ]);

    // Tổng số đơn, doanh thu, khách hàng toàn bộ
    const totalOrders = await this.orderRepository.count();
    const revenueRaw = await this.orderRepository
      .createQueryBuilder('o')
      .select('COALESCE(SUM(CAST(o.totalAmount AS DECIMAL)), 0)', 'sum')
      .getRawOne();
    const totalRevenue = parseFloat(revenueRaw?.sum || '0');
    const totalCustomers = await this.customerRepository.count();

    // Thống kê trong tháng hiện tại và tháng trước
    const today = new Date();
    const startCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );
    const startPrevMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    );
    const endCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1,
    );

    // Sản phẩm mới trong tháng hiện tại và tháng trước
    const productsThisMonth = await this.productRepository.count({
      where: {
        createdAt: {
          $gte: startCurrentMonth,
          $lt: endCurrentMonth,
        },
      },
    } as any);
    const productsPrevMonth = await this.productRepository.count({
      where: {
        createdAt: {
          $gte: startPrevMonth,
          $lt: startCurrentMonth,
        },
      },
    } as any);
    const productsGrowth = productsPrevMonth
      ? ((productsThisMonth - productsPrevMonth) / productsPrevMonth) * 100
      : productsThisMonth > 0
        ? 100
        : 0;

    // Đơn hàng/thống kê tháng hiện tại và tháng trước
    const ordersThisMonth = await this.orderRepository
      .createQueryBuilder('o')
      .where('o.orderDate >= :start AND o.orderDate < :end', {
        start: startCurrentMonth,
        end: endCurrentMonth,
      })
      .getCount();
    const ordersPrevMonth = await this.orderRepository
      .createQueryBuilder('o')
      .where('o.orderDate >= :start AND o.orderDate < :end', {
        start: startPrevMonth,
        end: startCurrentMonth,
      })
      .getCount();
    const ordersGrowth = ordersPrevMonth
      ? ((ordersThisMonth - ordersPrevMonth) / ordersPrevMonth) * 100
      : ordersThisMonth > 0
        ? 100
        : 0;

    // Doanh thu tháng hiện tại và tháng trước
    const revenueThisMonthRaw = await this.orderRepository
      .createQueryBuilder('o')
      .select('COALESCE(SUM(CAST(o.totalAmount AS DECIMAL)), 0)', 'sum')
      .where('o.orderDate >= :start AND o.orderDate < :end', {
        start: startCurrentMonth,
        end: endCurrentMonth,
      })
      .getRawOne();
    const totalRevenueThisMonth = parseFloat(revenueThisMonthRaw?.sum || '0');
    const revenuePrevMonthRaw = await this.orderRepository
      .createQueryBuilder('o')
      .select('COALESCE(SUM(CAST(o.totalAmount AS DECIMAL)), 0)', 'sum')
      .where('o.orderDate >= :start AND o.orderDate < :end', {
        start: startPrevMonth,
        end: startCurrentMonth,
      })
      .getRawOne();
    const totalRevenuePrevMonth = parseFloat(revenuePrevMonthRaw?.sum || '0');
    const revenueGrowth = totalRevenuePrevMonth
      ? ((totalRevenueThisMonth - totalRevenuePrevMonth) /
          totalRevenuePrevMonth) *
        100
      : totalRevenueThisMonth > 0
        ? 100
        : 0;

    // Khách hàng mới trong tháng hiện tại và tháng trước
    const customersThisMonthRaw = await this.orderRepository
      .createQueryBuilder('o')
      .select('COUNT(DISTINCT o.customerId)', 'count')
      .where('o.orderDate >= :start AND o.orderDate < :end', {
        start: startCurrentMonth,
        end: endCurrentMonth,
      })
      .getRawOne();
    const totalCustomersThisMonth = parseInt(
      customersThisMonthRaw?.count || '0',
      10,
    );
    const customersPrevMonthRaw = await this.orderRepository
      .createQueryBuilder('o')
      .select('COUNT(DISTINCT o.customerId)', 'count')
      .where('o.orderDate >= :start AND o.orderDate < :end', {
        start: startPrevMonth,
        end: startCurrentMonth,
      })
      .getRawOne();
    const totalCustomersPrevMonth = parseInt(
      customersPrevMonthRaw?.count || '0',
      10,
    );
    const customersGrowth = totalCustomersPrevMonth
      ? ((totalCustomersThisMonth - totalCustomersPrevMonth) /
          totalCustomersPrevMonth) *
        100
      : totalCustomersThisMonth > 0
        ? 100
        : 0;

    // Tăng trưởng doanh thu tháng (giữ lại nếu frontend dùng)
    const monthlyGrowth = revenueGrowth;

    // Tỷ lệ chuyển đổi toàn bộ
    const conversionRate = totalCustomers
      ? (totalOrders / totalCustomers) * 100
      : 0;

    return {
      totalProducts,
      totalOrders,
      totalRevenue,
      totalCustomers,
      lowStockProducts,
      monthlyGrowth: Number(monthlyGrowth.toFixed(2)),
      conversionRate: Number(conversionRate.toFixed(2)),
      productsGrowth: Number(productsGrowth.toFixed(2)),
      ordersGrowth: Number(ordersGrowth.toFixed(2)),
      revenueGrowth: Number(revenueGrowth.toFixed(2)),
      customersGrowth: Number(customersGrowth.toFixed(2)),
    };
  }

  async getSalesChart(days: number = 30): Promise<SalesChartDto[]> {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (days - 1));

    // Aggregate orders by date
    const raw = await this.orderRepository
      .createQueryBuilder('o')
      .select('DATE(o.order_date)', 'date')
      .addSelect('COALESCE(SUM(o.totalAmount), 0)', 'revenue')
      .addSelect('COUNT(*)', 'orders')
      .addSelect('COUNT(DISTINCT o.customerId)', 'customers')
      .where('o.order_date BETWEEN :start AND :end', { start, end })
      .groupBy('DATE(o.order_date)')
      .orderBy('DATE(o.order_date)', 'ASC')
      .getRawMany();
    // build map
    const map = new Map<string, any>();

    raw.forEach((r) => {
      // Convert SQL timestamp -> 'YYYY-MM-DD'
      const key = new Date(r.date).toISOString().split('T')[0];

      map.set(key, {
        revenue: Number(r.revenue) || 0,
        orders: Number(r.orders) || 0,
        customers: Number(r.customers) || 0,
      });
    });

    const data: SalesChartDto[] = [];

    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);

      const key = d.toISOString().split('T')[0];
      const v = map.get(key) || { revenue: 0, orders: 0, customers: 0 };

      data.push({
        date: key,
        revenue: v.revenue,
        orders: v.orders,
        customers: v.customers,
      });
    }

    return data;
  }

  async getTopProducts(limit: number = 5): Promise<TopProductDto[]> {
    // Aggregate sold quantities and revenue from order items for products
    const rows = await this.orderItemRepository
      .createQueryBuilder('it')
      .select('it.itemId', 'id')
      .addSelect('SUM(it.quantity)', 'sales')
      .addSelect('COALESCE(SUM(CAST(it.totalPrice AS DECIMAL)),0)', 'revenue')
      .where("it.type = 'product'")
      .groupBy('it.itemId')
      .orderBy('sales', 'DESC')
      .limit(limit)
      .getRawMany();

    const results: TopProductDto[] = [];
    for (const r of rows) {
      const id = parseInt(r.id, 10);
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) continue;

      results.push({
        id: product.id,
        name: product.name,
        sales: parseInt(r.sales || '0', 10),
        revenue: parseFloat(r.revenue || '0'),
        imageUrl: product.imageUrl || '/images/default-product.png',
      });
    }

    return results;
  }

  async getRecentActivities() {
    // recent orders
    const recentOrders = await this.orderRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['customer'],
    });

    const orderActivities = recentOrders.map((o) => ({
      id: o.id,
      action: `Đơn hàng #${o.orderNumber} (${o.status})`,
      user: o.customer?.name || 'Guest',
      time: o.createdAt,
      type: 'order',
      amount: o.totalAmount,
    }));

    // recent products
    const recentProducts = await this.productRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });

    const productActivities = recentProducts.map((p) => ({
      id: p.id,
      action: `Sản phẩm mới: ${p.name}`,
      user: '-',
      time: p.createdAt,
      type: 'product',
    }));

    // combine and sort by time desc
    const combined = [...orderActivities, ...productActivities].sort((a, b) => {
      const ta = new Date(a.time).getTime();
      const tb = new Date(b.time).getTime();
      return tb - ta;
    });

    return combined.slice(0, 10);
  }
}
