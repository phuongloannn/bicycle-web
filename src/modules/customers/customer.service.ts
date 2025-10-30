import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // --- 🧩 Hàm tạo dữ liệu mẫu ---
  async createSampleCustomers(): Promise<void> {
    const customers = [
      {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0901234567',
        address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
      },
      {
        name: 'Trần Thị B',
        email: 'tranthib@email.com',
        phone: '0907654321',
        address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
      },
    ];

    for (const customerData of customers) {
      const existing = await this.customerRepository.findOne({
        where: { email: customerData.email },
      });

      if (!existing) {
        const customer = this.customerRepository.create(customerData);
        await this.customerRepository.save(customer);
      }
    }
  }

  // --- ✅ TẠO KHÁCH HÀNG MỚI ---
  async create(createCustomerDto: any): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findOne({
      where: { email: createCustomerDto.email },
    });

    if (existingCustomer) {
      throw new BadRequestException('Email already exists');
    }

    const customer = this.customerRepository.create(createCustomerDto as Customer);
    const savedCustomer = await this.customerRepository.save(customer);
    return savedCustomer;
  }

  // --- ✅ Lấy danh sách tất cả khách hàng ---
  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  // --- ✅ Lấy thông tin một khách hàng theo ID ---
  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  // --- ✅ CẬP NHẬT THÔNG TIN KHÁCH HÀNG ---
  async update(id: number, updateCustomerDto: any): Promise<Customer> {
    const customer = await this.findOne(id);

    // Kiểm tra email mới có trùng với khách hàng khác không
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingCustomer = await this.customerRepository.findOne({
        where: { email: updateCustomerDto.email },
      });

      if (existingCustomer) {
        throw new BadRequestException('Email already exists');
      }
    }

    Object.assign(customer, updateCustomerDto);
    return await this.customerRepository.save(customer);
  }

  // --- ✅ XÓA KHÁCH HÀNG ---
  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }

  // --- 🔍 TÌM KIẾM KHÁCH HÀNG THEO EMAIL ---
  async findByEmail(email: string): Promise<Customer | null> {
    return await this.customerRepository.findOne({ where: { email } });
  }
}
