import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { DashboardStatsDto } from './dto/responses/dashboard-stats.dto';
import { SalesChartDto } from './dto/responses/sales-chart.dto';
import { TopProductDto } from './dto/responses/top-product.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getDashboardStats(): Promise<DashboardStatsDto> {
    const [
      totalProducts,
      lowStockProducts,
    ] = await Promise.all([
      this.productRepository.count(),
      this.productRepository.count({ where: { quantity: LessThan(10) } }),
    ]);

    // Mock data - bạn có thể thay bằng real data sau
    const totalOrders = 1250;
    const totalRevenue = 89456.78;
    const totalCustomers = 342;
    const monthlyGrowth = 12.5;
    const conversionRate = 3.2;

    return {
      totalProducts,
      totalOrders,
      totalRevenue,
      totalCustomers,
      lowStockProducts,
      monthlyGrowth,
      conversionRate,
    };
  }

  async getSalesChart(days: number = 30): Promise<SalesChartDto[]> {
    // Tạo dữ liệu mẫu cho biểu đồ
    const data: SalesChartDto[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 5000) + 1000,
        orders: Math.floor(Math.random() * 50) + 10,
        customers: Math.floor(Math.random() * 30) + 5,
      });
    }
    
    return data;
  }

  async getTopProducts(limit: number = 5): Promise<TopProductDto[]> {
    const products = await this.productRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return products.map(product => ({
      id: product.id,
      name: product.name,
      sales: Math.floor(Math.random() * 100) + 10, // Mock data
      revenue: product.price * (Math.floor(Math.random() * 100) + 10),
      imageUrl: product.imageUrl || '/images/default-product.png',
    }));
  }

  async getRecentActivities() {
    // Mock recent activities
    return [
      { id: 1, action: 'Đơn hàng mới', user: 'Nguyễn Văn A', time: '2 phút trước', type: 'order' },
      { id: 2, action: 'Sản phẩm mới được thêm', user: 'Trần Thị B', time: '5 phút trước', type: 'product' },
      { id: 3, action: 'Thanh toán thành công', user: 'Lê Văn C', time: '10 phút trước', type: 'payment' },
      { id: 4, action: 'Người dùng mới đăng ký', user: 'Phạm Thị D', time: '15 phút trước', type: 'user' },
    ];
  }
}