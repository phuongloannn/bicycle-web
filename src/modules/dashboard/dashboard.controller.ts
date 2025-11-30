import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardStatsDto } from './dto/responses/dashboard-stats.dto';
import { SalesChartDto } from './dto/responses/sales-chart.dto';
import { TopProductDto } from './dto/responses/top-product.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(): Promise<DashboardStatsDto> {
    return this.dashboardService.getDashboardStats();
  }

  @Get('sales-chart')
  async getSalesChart(
    @Query('days') days: number = 30
  ): Promise<SalesChartDto[]> {
    return this.dashboardService.getSalesChart(+days);
  }

  @Get('top-products')
  async getTopProducts(
    @Query('limit') limit: number = 5
  ): Promise<TopProductDto[]> {
    return this.dashboardService.getTopProducts(+limit);
  }

  @Get('recent-activities')
  async getRecentActivities() {
    return this.dashboardService.getRecentActivities();
  }
}