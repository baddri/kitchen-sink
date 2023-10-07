import { Injectable } from '@nestjs/common';
import { RedisService } from '../services/redis.service';

@Injectable()
export class AppService {
  constructor(private redis: RedisService) {}

  getHello(): string {
    return 'Hello World!';
  }

  public async getNumVisits() {
    const numVisitsRaw = await this.redis.client.get('numVisits');
    let numVisits = parseInt(numVisitsRaw) + 1;
    if (isNaN(numVisits)) {
      numVisits = 1;
    }
    await this.redis.client.set('numVisits', numVisits);
    return numVisits;
  }
}
