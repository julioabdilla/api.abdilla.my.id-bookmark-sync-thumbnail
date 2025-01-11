import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@nestjs/config';
import { AppModule } from 'src/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `abdillamyid-bookmarkthumbnail-service`,
        brokers: [`${configService.get<string>('KAFKA_HOST')}:${configService.get<string>('KAFKA_PORT')}`],
      },
      consumer: {
        groupId: 'abdillamyid-bookmarkthumbnail-consumer',
      },
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
