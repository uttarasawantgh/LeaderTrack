import type { AppData, SessionLog, BookId, Book } from "../types";
import { INITIAL_DATA } from "../types";

const STORAGE_KEY = "leadertrack_data";

/** Migrate a single book's stale "Gifted Edition 🎁" label to the new one. */
function migrateBook(book: Book): Book {
  if (book.author === "Gifted Edition 🎁") {
    return { ...book, author: "Special Edition 🎁" };
  }
  return book;
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppData;
      // Ensure both books exist (in case of schema update)
      if (!parsed.books || parsed.books.length === 0) {
        parsed.books = INITIAL_DATA.books.map((b) => ({ ...b }));
      } else {
        // Migrate stale author labels
        parsed.books = parsed.books.map(migrateBook);
      }
      return parsed;
    }
  } catch {
    // Corrupted data — reset
  }
  return { ...INITIAL_DATA, books: INITIAL_DATA.books.map((b) => ({ ...b })) };
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

// Reducer action types
export type AppAction =
  | { type: "LOAD_DATA"; payload: AppData }
  | { type: "ADD_SESSION"; payload: SessionLog }
  | { type: "TOGGLE_BEDTIME"; payload: { date: string; bookId: BookId } }
  | { type: "UPDATE_BOOK_PROGRESS"; payload: { bookId: BookId; currentPage: number } }
  | { type: "ADD_BOOK"; payload: Book };

export function appReducer(state: AppData, action: AppAction): AppData {
  switch (action.type) {
    case "LOAD_DATA":
      return action.payload;

    case "ADD_SESSION": {
      const session = action.payload;
      const newSessions = [session, ...state.sessions];

      // Update book progress
      const newBooks = state.books.map((book) => {
        if (book.id === session.bookId) {
          return {
            ...book,
            currentPage: Math.min(
              book.currentPage + session.pagesRead,
              book.totalPages
            ),
          };
        }
        return book;
      });

      return {
        ...state,
        sessions: newSessions,
        books: newBooks,
      };
    }

    case "TOGGLE_BEDTIME": {
      const { date, bookId } = action.payload;
      const alreadyDone = state.bedtimeLogs.includes(date);

      if (alreadyDone) {
        // Remove bedtime log and its associated session entry
        const newBedtimeLogs = state.bedtimeLogs.filter((d) => d !== date);
        const newSessions = state.sessions.filter(
          (s) =>
            !(
              s.date === date &&
              s.bedtimeReading &&
              s.bookId === bookId &&
              s.pagesRead === 0 &&
              s.takeaway === "" &&
              s.quote === "" &&
              s.warning === ""
            )
        );
        return {
          ...state,
          bedtimeLogs: newBedtimeLogs,
          sessions: newSessions,
        };
      } else {
        // Add bedtime log and create a minimal session entry
        const newBedtimeLogs = [...state.bedtimeLogs, date];
        const bedtimeSession: SessionLog = {
          id: crypto.randomUUID(),
          date,
          bookId,
          timeInvested: 15,
          pagesRead: 0,
          takeaway: "",
          quote: "",
          warning: "",
          bedtimeReading: true,
          createdAt: new Date().toISOString(),
        };
        return {
          ...state,
          bedtimeLogs: newBedtimeLogs,
          sessions: [bedtimeSession, ...state.sessions],
        };
      }
    }

    case "UPDATE_BOOK_PROGRESS": {
      const { bookId, currentPage } = action.payload;
      const newBooks = state.books.map((book) =>
        book.id === bookId
          ? {
              ...book,
              currentPage: Math.min(currentPage, book.totalPages),
            }
          : book
      );
      return {
        ...state,
        books: newBooks,
      };
    }

    case "ADD_BOOK": {
      // Don't add a book with the same id
      if (state.books.some((b) => b.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        books: [...state.books, action.payload],
      };
    }

    default:
      return state;
  }
}