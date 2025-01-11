import { Bookmark } from "@/modules/bookmark/bookmark.model";
import { ConfigService } from "@nestjs/config";
import { Sequelize } from "sequelize-typescript";

export const providers = [
  {
    provide: 'SEQUELIZE',
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const sequelize = new Sequelize(config.get<string>('DB_NAME'), config.get<string>('DB_USERNAME'), config.get<string>('DB_PASSWORD'), {
        dialect: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        database: config.get<string>('DB_NAME'),
        dialectOptions: {
          connectTimeout: 30000,
        },
        pool: {
          max: 100,
          min: 0,
          idle: 10000,
        },
      });
      sequelize.addModels([Bookmark]);
      await sequelize.sync();
      return sequelize;
    },
  },
]
