import { BadRequestException, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { RedisService } from '../../services/redis.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from '../../services/database.service';

/** available product table */
const AVAILABLE_PRODUCT_TABLE = 'available_product';

/** max product count */
const MAX_PRODUCT_COUNT = 5;

/** schedule time */
const SCHEDULE_INTERVAL = CronExpression.EVERY_30_SECONDS;

@Injectable()
export class ProductService implements OnApplicationBootstrap {
  private logger = new Logger(ProductService.name);
  constructor(
    private redis: RedisService,
    private db: DatabaseService,
  ) {}

  // Run service lifecycle after module initialized and ready to accept connection
  async onApplicationBootstrap() {
    // set product initial value
    await this.db.query(
      `CREATE type::table($table) CONTENT {
        number_available: $number_available,
        timestamp: time::now(),
        id: rand::ulid()
      }`,
      {
        table: AVAILABLE_PRODUCT_TABLE,
        number_available: 0,
      },
    );
  }

  /**
   * get product available count the key is set above
   * the list operation expected to be safe because the key is already initialized
   * @return number
   */
  public async getProductAvailableCount() {
    return (
      await this.db.query(
        `
        SELECT 
          meta::id(id) as id, 
          number_available,
          timestamp,
          time::format(timestamp, "%B %m %Y at %r") as last_updated
        FROM type::table($table)
        ORDER BY timestamp
        DESC LIMIT 1`,
        {
          table: AVAILABLE_PRODUCT_TABLE,
        },
      )
    )[0];
  }

  /**
   * get one product by substraction the available product by one
   * if the product count is already 0 then do nothing
   * @type {BadRequestException} is throwed if failed
   */
  public async getOneProduct() {
    this.logger.log('Getting One Product');

    try {
      await this.db.query(
        `
        BEGIN TRANSACTION;

        -- The purpose of this select is to lock this row 
        LET $latest_row = (SELECT * FROM type::table($table) ORDER BY timestamp DESC LIMIT 1);

        LET $latest_count = array::first($latest_row.number_available);

        IF $latest_count > 0 THEN
          CREATE type::table($table) SET id = rand:ulid(), number_available = $latest_count - 1, timestamp = time::now();
        END;

        COMMIT TRANSACTION;
      `,
        {
          table: AVAILABLE_PRODUCT_TABLE,
        },
      );
    } catch (e) {
      this.logger.log('FAILED to get one Product');
    }
    this.logger.log('SUCCESS get one Product');
  }

  /**
   * add one product by increment the available product by one every INTERVAL
   * if the product count is already MAX then do nothing
   */
  @Cron(SCHEDULE_INTERVAL)
  public async addOneProduct() {
    this.logger.log('Adding One Product');

    try {
      await this.db.query(
        `
        BEGIN TRANSACTION;

        -- The purpose of this select is to lock this row 
        LET $latest_row = (SELECT * FROM type::table($table) ORDER BY timestamp DESC LIMIT 1);

        LET $latest_count = array::first($latest_row.number_available);

        IF $latest_count < $max_product THEN
          CREATE type::table($table) SET id = rand:ulid(), number_available = $latest_count + 1, timestamp = time::now();
        END;

        COMMIT TRANSACTION;
      `,
        {
          table: AVAILABLE_PRODUCT_TABLE,
          max_product: MAX_PRODUCT_COUNT,
        },
      );
    } catch (e) {
      this.logger.log('FAILED to add one Product');
      throw new BadRequestException('Something Bad happened');
    }
    this.logger.log('SUCCESS add one Product');
  }
}
