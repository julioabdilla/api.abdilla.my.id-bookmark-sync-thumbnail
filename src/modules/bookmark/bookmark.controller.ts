import { Controller } from "@nestjs/common";
import { BookmarkService } from "./bookmark.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { SyncThumbail } from "./bookmark.dto";

@Controller()
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) { }

  @MessagePattern('abdillamyid-bookmark-sync_thumbnail')
  syncThumbnail(@Payload() payload: SyncThumbail) {
    this.bookmarkService.syncThumbnail(payload.bookmarkId, payload.link);
  }
}