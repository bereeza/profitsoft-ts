import {QueryDto} from "../queryDto";

export class ReviewQueryDto extends QueryDto {
  songId?: number;

  constructor(query?: Partial<ReviewQueryDto>) {
    super();
    if (query) {
      this.songId = query.songId;
      this.size = query.size || 1;
      this.from = query.from || 0;
    }
  }
}