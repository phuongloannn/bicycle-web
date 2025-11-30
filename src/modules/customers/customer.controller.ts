import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Put } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CustomerResponseDto } from "./dto/response/customer-response.dto";
import { ApiResponseDto } from "src/common/dto/api-response.dto";
import { CustomerService } from "./customer.service";
import { Customer } from "./entities/customer.entity";
import { plainToInstance } from "class-transformer";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {

    constructor(private readonly customerService: CustomerService) {}

    // ✅ CREATE
    @Post()
    @ApiOkResponse({ type: ApiResponseDto<Customer> })
    async create(@Body() createCustomerDto: any): Promise<ApiResponseDto<Customer>> {
        const customer = await this.customerService.create(createCustomerDto);
        return {
            statusCode: 201,
            message: 'Customer created successfully',
            data: customer
        };
    }

    // ✅ GET ALL CUSTOMERS
    @Get()
    // @UseGuards(JwtAuthGuard) // ✅ CHỈ dùng JWT guard
    @ApiOkResponse({ 
        type: ApiResponseDto, 
        description: 'Get all customers',
        isArray: true
    })
    async findAll(@Req() req): Promise<ApiResponseDto<Customer[]>> {
        // console.log('>>> Current user:', req.user);
        var listCustomers = await this.customerService.findAll();
        return {
            statusCode: 200,
            message: 'Success',
            data: listCustomers
        }
    }
    
    // ✅ GET CUSTOMER BY ID
    @Get(':id')
   // @UseGuards(JwtAuthGuard) // ✅ CHỈ dùng JWT guard
    @ApiOkResponse({ type: ApiResponseDto<CustomerResponseDto> })
    async findOne(@Param('id') id: number): Promise<ApiResponseDto<CustomerResponseDto | null>> {
        var customer = plainToInstance(CustomerResponseDto, await this.customerService.findOne(id), { excludeExtraneousValues: true });
        
        return {
            statusCode: 200,
            message: 'Successfully',
            data: customer
        }
    }

    // ✅ UPDATE
    @Put(':id')
   // @UseGuards(JwtAuthGuard) // ✅ CHỈ dùng JWT guard
    @ApiOkResponse({ type: ApiResponseDto<Customer> })
    async update(@Param('id') id: number, @Body() updateCustomerDto: any): Promise<ApiResponseDto<Customer>> {
        const customer = await this.customerService.update(id, updateCustomerDto);
        return {
            statusCode: 200,
            message: 'Customer updated successfully',
            data: customer
        };
    }

    // ✅ DELETE
    @Delete(':id')
   // @UseGuards(JwtAuthGuard) // ✅ CHỈ dùng JWT guard
    @ApiOkResponse({ type: ApiResponseDto<string> })
    async remove(@Param('id') id: number): Promise<ApiResponseDto<string>> {
        await this.customerService.remove(id);
        return {
            statusCode: 200,
            message: 'Customer deleted successfully',
            data: 'deleted'
        };
    }

    // ✅ SEED DATA (public - không cần auth)
    @Post('seed')
    @ApiOkResponse({ type: ApiResponseDto<string> })
    async seedSampleData(): Promise<ApiResponseDto<string>> {
        await this.customerService.createSampleCustomers();
        return {
            statusCode: 201,
            message: 'Sample customers created successfully',
            data: 'seeded'
        };
    }
}