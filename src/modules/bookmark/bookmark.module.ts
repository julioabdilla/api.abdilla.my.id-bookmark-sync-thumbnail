import { Module } from "@nestjs/common";
import { BookmarkController } from "./bookmark.controller";
import { DatabaseModule } from "@/database";
import { providers } from "./bookmark.provider";

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [BookmarkController],
  providers: [...providers],
})
export class BookmarkModule { }