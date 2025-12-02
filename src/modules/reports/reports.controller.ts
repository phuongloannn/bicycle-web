import {
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('revenue')
  getRevenue(
    @Query('groupBy') groupBy: 'day' | 'week' | 'month' | 'year' = 'day',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.getRevenueReport(groupBy, from, to);
  }

  @Get('orders')
  getOrders(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.getOrdersReport(from, to);
  }

  @Get('inventory')
  getInventory() {
    return this.reportsService.getInventoryReport();
  }

  @Get('top-products')
  getTopProducts(@Query('limit') limit = 5) {
    return this.reportsService.getTopProducts(+limit);
  }

  @Get('top-customers')
  getTopCustomers(@Query('limit') limit = 5) {
    return this.reportsService.getTopCustomers(+limit);
  }

  @Get('trends')
  getTrends(@Query('days') days = 30) {
    return this.reportsService.getTrends(+days);
  }

  // CSV export (Excel-compatible)
  @Get('export')
  async exportCsv(
    @Query('type') type: 'revenue' | 'orders' | 'inventory',
    @Query('groupBy') groupBy: 'day' | 'week' | 'month' | 'year' = 'day',
    @Query('from') from: string | undefined,
    @Query('to') to: string | undefined,
    @Res() res: Response,
  ) {
    const { filename, content } = await this.reportsService.exportCsv(type, {
      groupBy,
      from,
      to,
    });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"`,
    );
    res.send(content);
  }
}


