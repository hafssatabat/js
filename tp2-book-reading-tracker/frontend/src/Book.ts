export type BookStatus =
  | "Read"
  | "Re-read"
  | "DNF"
  | "Currently reading"
  | "Returned unread"
  | "Want to read";

export type BookFormat =
  | "Print"
  | "PDF"
  | "Ebook"
  | "AudioBook";

export class Book {
  title: string;
  author: string;
  pages: number;
  status: BookStatus;
  price: number;
  pagesRead: number;
  format: BookFormat;
  suggestedBy: string;
  finished: boolean;

  constructor(
    title: string,
    author: string,
    pages: number,
    status: BookStatus,
    price: number,
    pagesRead: number,
    format: BookFormat,
    suggestedBy: string
  ) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.price = price;
    this.pagesRead = pagesRead;
    this.format = format;
    this.suggestedBy = suggestedBy;
    this.finished = pagesRead >= pages;
  }

  currentlyAt(): number {
    return Math.round((this.pagesRead / this.pages) * 100);
  }

  deleteBook(): string {
    return `${this.title} supprimé`;
  }
}