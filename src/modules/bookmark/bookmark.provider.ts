import { Bookmark as BookmarkModel } from "./bookmark.model";
import { BookmarkService } from "./bookmark.service";

export const providers = [
  {
    provide: BookmarkModel.REPOSITORY_NAME,
    useValue: BookmarkModel,
  },
  BookmarkService,
];
