import { BadRequestException, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { RedisService } from '../../services/redis.service';
import { Cron, CronExpression } from '@nestjs/schedule';

/** key for available product count */
const PRODUCT_AVAILABLE_COUNT_KEY = 'PRODUCT_AVAILABLE_COUNT';

/** max product count */
const MAX_PRODUCT_COUNT = 5;

/** schedule time */
const SCHEDULE_INTERVAL = CronExpression.EVERY_30_SECONDS;

@Injectable()
export class ProductService implements OnApplicationBootstrap {
  private logger = new Logger(ProductService.name);
  constructor(private redis: RedisService) {}

  // Run service lifecycle after module initialized and ready to accept connection
  async onApplicationBootstrap() {
    // set product initial value
    await this.redis.client.json.SET(PRODUCT_AVAILABLE_COUNT_KEY, '$', 0);
  }

  /**
   * get product available count the key is set above
   * the list operation expected to be safe because the key is already initialized
   * @return number
   */
  public async getProductAvailableCount() {
    const res = await this.redis.client.json.GET(PRODUCT_AVAILABLE_COUNT_KEY, {
      path: '$',
    });
    return res[0];
  }

  /**
   * get one product by substraction the available product by one
   * if the product count is already 0 then do nothing
   * @type {BadRequestException} is throwed if failed
   */
  public async getOneProduct() {
    await this.redis.client.executeIsolated(async (isolatedClient) => {
      await isolatedClient.WATCH(PRODUCT_AVAILABLE_COUNT_KEY);
      const count = await isolatedClient.json.GET(PRODUCT_AVAILABLE_COUNT_KEY, {
        path: '$',
      });

      const multi = isolatedClient.multi();

      if (count[0] > 0) {
        multi.json.NUMINCRBY(PRODUCT_AVAILABLE_COUNT_KEY, '$', -1);
      } else {
        throw new BadRequestException('Theres no product available');
      }
      try {
        await multi.EXEC();
      } catch (error) {
        throw new BadRequestException('Failed to get one product');
      }
    });
  }

  /**
   * add one product by increment the available product by one every INTERVAL
   * if the product count is already MAX then do nothing
   */
  @Cron(SCHEDULE_INTERVAL)
  private async addOneProduct() {
    this.logger.log('Adding One Product');
    await this.redis.client.executeIsolated(async (isolatedClient) => {
      await isolatedClient.WATCH(PRODUCT_AVAILABLE_COUNT_KEY);
      const count = await isolatedClient.json.GET(PRODUCT_AVAILABLE_COUNT_KEY, {
        path: '$',
      });

      const multi = isolatedClient.multi();

      if (count[0] < MAX_PRODUCT_COUNT) {
        multi.json.NUMINCRBY(PRODUCT_AVAILABLE_COUNT_KEY, '$', 1);
      }
      try {
        await multi.EXEC();
        this.logger.log('Success add one Product');
      } catch (error) {
        this.logger.log('Failed to add one Product');
      }
    });
  }
}
