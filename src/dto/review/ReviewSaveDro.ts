export class ReviewSaveDto {
  comment?: string;
  rating?: number;
  date?: Date;
  songId?: number;

  constructor(data: Partial<ReviewSaveDto>) {
    this.comment = data.comment;
    this.rating = data.rating;
    this.date = data.date;
    this.songId = data.songId;
  }
}