import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // POST /products - Menambah produk baru
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    if (!createProductDto.name || createProductDto.price === undefined) {
      throw new BadRequestException('Name and price are required');
    }
    if (createProductDto.price < 0) {
      throw new BadRequestException('Price must be greater than or equal to 0');
    }
    return this.productsService.create(createProductDto);
  }

  // GET /products/search?q=keyword - Mencari produk (harus sebelum :id)
  @Get('search')
  async search(@Query('q') keyword: string): Promise<Product[]> {
    return this.productsService.search(keyword);
  }

  // GET /products - Mendapatkan semua produk
  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  // GET /products/:id - Mendapatkan produk berdasarkan ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  // PUT /products/:id - Mengupdate produk
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    if (updateProductDto.price !== undefined && updateProductDto.price < 0) {
      throw new BadRequestException('Price must be greater than or equal to 0');
    }
    return this.productsService.update(id, updateProductDto);
  }

  // DELETE /products/:id - Menghapus produk
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.productsService.delete(id);
  }
}
