import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/visits')
  public async getNumberVisits() {
    return this.appService.getNumVisits();
  }

  @Get('/test')
  public async testSurreal() {
    return await this.appService.testSurreal();
  }
}
