import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Surreal } from 'surrealdb.node';

@Injectable()
export class DatabaseService extends Surreal implements OnModuleInit {
  constructor(private config: ConfigService) {
    super();
  }

  async onModuleInit() {
    await this.connect(`ws://db:${this.config.get('DATABASE_PORT')}`);
    await this.signin({
      username: this.config.get('DATABASE_USER'),
      password: this.config.get('DATABASE_PASSWORD'),
    });
    await this.use({
      ns: this.config.get('DATABASE_NAMESPACE'),
      db: this.config.get('DATABASE_NAME'),
    });
  }
}
