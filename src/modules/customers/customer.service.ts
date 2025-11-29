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

  // --- 🧩 Seed dữ liệu mẫu ---
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

    for (const data of customers) {
      const exists = await this.customerRepository.findOne({ where: { email: data.email } });

      if (!exists) {
        await this.customerRepository.save(this.customerRepository.create(data));
      }
    }
  }

  // --- ✅ CREATE CUSTOMER ---
  async create(createCustomerDto: any): Promise<Customer> {
    const exists = await this.customerRepository.findOne({
      where: { email: createCustomerDto.email },
    });

    if (exists) {
      throw new BadRequestException('Email already exists');
    }

    const customer = this.customerRepository.create(createCustomerDto as Customer);
    return await this.customerRepository.save(customer);
  }

  // --- ✅ GET ALL - FIXED COMPLETELY ---
  async findAll(): Promise<Customer[]> {
    try {
      const customers = await this.customerRepository.find({
        relations: ['orders'],
      }) as Customer[];
      return customers;
    } catch (error) {
      console.error('Error in findAll:', error);
      return [];
    }
  }

  // --- ✅ GET ONE ---
  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ 
      where: { id },
      relations: ['orders'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  // --- 🔍 FIND BY EMAIL ---
  async findByEmail(email: string): Promise<Customer | null> {
    return await this.customerRepository.findOne({
      where: { email },
      relations: ['orders'],
    });
  }

  // --- ✅ UPDATE / PATCH CUSTOMER ---
  async update(id: number, updateCustomerDto: any): Promise<Customer> {
    const customer = await this.findOne(id);

    // Nếu đang PATCH, FE có thể chỉ gửi name/phone/address
    // Chỉ validate email khi FE gửi email
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const exists = await this.customerRepository.findOne({
        where: { email: updateCustomerDto.email },
      });

      if (exists) {
        throw new BadRequestException('Email already exists');
      }
    }

    // Gộp dữ liệu mới vào object hiện tại
    Object.assign(customer, updateCustomerDto);

    return await this.customerRepository.save(customer);
  }

  // --- ❌ DELETE ---
  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }
}