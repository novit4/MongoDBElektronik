import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  // CREATE: Menambah produk baru
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  // READ: Mendapatkan semua produk
  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  // READ: Mendapatkan produk berdasarkan ID
  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // UPDATE: Mengupdate produk berdasarkan ID
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  // DELETE: Menghapus produk berdasarkan ID
  async delete(id: string): Promise<{ message: string }> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return { message: `Product with ID ${id} successfully deleted` };
  }

  // SEARCH: Mencari produk berdasarkan nama (case-insensitive)
  async search(keyword: string): Promise<Product[]> {
    if (!keyword || keyword.trim() === '') {
      throw new BadRequestException('Search keyword cannot be empty');
    }
    return this.productModel
      .find({ name: { $regex: keyword, $options: 'i' } })
      .exec();
  }
}
