import { Module } from '@nestjs/common';
import { BookmarkModule } from './modules/bookmark/bookmark.module';
import { DatabaseModule } from './database';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true,
    }),
    DatabaseModule,
    BookmarkModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}