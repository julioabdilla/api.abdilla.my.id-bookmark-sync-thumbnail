import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { providers } from './database.provider';

@Module({
  imports: [ConfigModule],
  providers: [...providers],
  exports: []
})
export class DatabaseModule { }
