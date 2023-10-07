import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  public client: ReturnType<typeof createClient>;

  async onModuleInit() {
    this.client = await createClient({
      socket: {
        host: 'redis',
        port: 6379,
      },
    }).connect();
  }
}
