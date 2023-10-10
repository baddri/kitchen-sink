import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly product: ProductService) {}

  @Get('/available-count')
  public async getProductAvailableCount() {
    return await this.product.getProductAvailableCount();
  }

  @Get('/get-one')
  public async getOneProduct() {
    await this.product.getOneProduct();
    return 'OK';
  }
}
