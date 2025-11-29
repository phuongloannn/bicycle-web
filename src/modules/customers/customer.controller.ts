import { 
    Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Put 
} from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CustomerResponseDto } from "./dto/response/customer-response.dto";
import { ApiResponseDto } from "src/common/dto/api-response.dto";
import { CustomerService } from "./customer.service";
import { Customer } from "./entities/customer.entity";
import { plainToInstance } from "class-transformer";
// import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {

    constructor(private readonly customerService: CustomerService) {}

    // ✅ CREATE CUSTOMER
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
    @ApiOkResponse({ type: ApiResponseDto, isArray: true })
    async findAll(@Req() req): Promise<ApiResponseDto<Customer[]>> {
        const listCustomers = await this.customerService.findAll();
        return {
            statusCode: 200,
            message: 'Success',
            data: listCustomers
        };
    }

    // ✅ GET CUSTOMER BY ID
    @Get(':id')
    @ApiOkResponse({ type: ApiResponseDto<CustomerResponseDto> })
    async findOne(@Param('id') id: number): Promise<ApiResponseDto<CustomerResponseDto | null>> {
        const customer = plainToInstance(
            CustomerResponseDto,
            await this.customerService.findOne(id),
            { excludeExtraneousValues: true }
        );

        return {
            statusCode: 200,
            message: 'Successfully',
            data: customer
        };
    }

    // ✅ GET CUSTOMER BY EMAIL
    @Get('bymail/:email')
    @ApiOkResponse({ type: ApiResponseDto<CustomerResponseDto> })
    async findByEmail(@Param('email') email: string): Promise<ApiResponseDto<CustomerResponseDto | null>> {
        const customer = plainToInstance(
            CustomerResponseDto,
            await this.customerService.findByEmail(email),
            { excludeExtraneousValues: true }
        );

        return {
            statusCode: 200,
            message: 'Successfully',
            data: customer
        };
    }

    // ✅ FULL UPDATE (PUT)
    @Put(':id')
    @ApiOkResponse({ type: ApiResponseDto<Customer> })
    async update(@Param('id') id: number, @Body() updateCustomerDto: any): Promise<ApiResponseDto<Customer>> {
        const customer = await this.customerService.update(id, updateCustomerDto);

        return {
            statusCode: 200,
            message: 'Customer updated successfully',
            data: customer
        };
    }

    // ✅ PARTIAL UPDATE (PATCH) — FE checkout cần method này
    @Patch(':id')
    @ApiOkResponse({ type: ApiResponseDto<Customer> })
    async patchUpdate(@Param('id') id: number, @Body() partialUpdateDto: any): Promise<ApiResponseDto<Customer>> {
        const customer = await this.customerService.update(id, partialUpdateDto);

        return {
            statusCode: 200,
            message: 'Customer partially updated successfully',
            data: customer
        };
    }

    // ✅ DELETE CUSTOMER
    @Delete(':id')
    @ApiOkResponse({ type: ApiResponseDto<string> })
    async remove(@Param('id') id: number): Promise<ApiResponseDto<string>> {
        await this.customerService.remove(id);
        return {
            statusCode: 200,
            message: 'Customer deleted successfully',
            data: 'deleted'
        };
    }

    // ✅ SEED SAMPLE CUSTOMER DATA
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
