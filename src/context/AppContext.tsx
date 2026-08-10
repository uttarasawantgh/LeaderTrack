import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";
import type { AppData, Book, BookId, SessionLog } from "../types";
import { INITIAL_DATA } from "../types";
import { appReducer, loadData, saveData, type AppAction } from "./appReducer";

interface AppContextValue {
  data: AppData;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    addSession: (session: SessionLog) => void;
    toggleBedtime: (date: string, bookId: BookId) => void;
    updateBookProgress: (bookId: BookId, currentPage: number) => void;
    addBook: (book: Book) => void;
  };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(appReducer, INITIAL_DATA, () =>
    loadData()
  );

  // Persist on every change
  useEffect(() => {
    saveData(data);
  }, [data]);

  const actions: AppContextValue["actions"] = {
    addSession: (session) => dispatch({ type: "ADD_SESSION", payload: session }),
    toggleBedtime: (date, bookId) =>
      dispatch({ type: "TOGGLE_BEDTIME", payload: { date, bookId } }),
    updateBookProgress: (bookId, currentPage) =>
      dispatch({ type: "UPDATE_BOOK_PROGRESS", payload: { bookId, currentPage } }),
    addBook: (book) => dispatch({ type: "ADD_BOOK", payload: book }),
  };

  return (
    <AppContext.Provider value={{ data, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}