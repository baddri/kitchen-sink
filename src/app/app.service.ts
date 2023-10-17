import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../services/redis.service';
import { DatabaseService } from '../services/database.service';
import fs from 'fs/promises';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);
  constructor(
    private redis: RedisService,
    private db: DatabaseService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  public async getNumVisits() {
    const numVisitsRaw = await this.redis.client.get('NUM_VISITS');
    let numVisits = parseInt(numVisitsRaw) + 1;
    if (isNaN(numVisits)) {
      numVisits = 1;
    }
    await this.redis.client.set('NUM_VISITS', numVisits);
    return numVisits;
  }

  public async testSurreal() {
    const buf = await fs.readFile('src/api/test-query.sql', { encoding: 'utf8' });
    const data = await this.db.query(buf);
    this.logger.debug(data);
    return data;
  }
}
