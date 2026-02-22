import { createContext, useContext, useState } from "react";

const HistoryContext = createContext(null);

export function HistoryProvider({ children }){
    const [history,setHistory] = useState([]);
    console.log("HistoryProvider mounted");

    const addToHistory= (movie) => {
        const watchedAt = new Date().toISOString();

        setHistory((prev) => {

            const filtered = prev.filter((m) => String(m.id) !== String(movie.id));
            const updated = [{ ...movie, watchedAt }, ...filtered];
            return updated.slice(0, 20);
        });
    };
    return (
        <HistoryContext.Provider value={{ history, addToHistory }}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory(){
    const ctx = useContext(HistoryContext);
    if(!ctx) throw new Error("useHistory must be used inside HistoryProvider");
    return ctx;
}