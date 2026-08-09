export type BookId = "navigating-change" | "ethicability";

export type TimeOption = 15 | 30 | 45 | 60;

export interface Book {
  id: BookId;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
}

export interface SessionLog {
  id: string;
  date: string; // YYYY-MM-DD
  bookId: BookId;
  timeInvested: TimeOption;
  pagesRead: number;
  takeaway: string;
  quote: string;
  warning: string;
  bedtimeReading: boolean;
  createdAt: string; // ISO timestamp
}

export interface AppData {
  books: Book[];
  sessions: SessionLog[];
  bedtimeLogs: string[]; // YYYY-MM-DD dates
}

export const DEFAULT_BOOKS: Book[] = [
  {
    id: "navigating-change",
    title: "Navigating Change",
    author: "Ralph Nader",
    totalPages: 233,
    currentPage: 0,
  },
  {
    id: "ethicability",
    title: "Ethicability",
    author: "Roger Steare",
    totalPages: 128,
    currentPage: 0,
  },
];

export const INITIAL_DATA: AppData = {
  books: DEFAULT_BOOKS,
  sessions: [],
  bedtimeLogs: [],
};