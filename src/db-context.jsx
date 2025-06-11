import Dexie from "dexie";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

const db = new Dexie("mood-tracker-db");

db.version(1).stores({
  moods: "id",
});

const DBContext = createContext({});

export const useDBContext = () => useContext(DBContext);

const DBContextProvider = ({ children }) => {
  return <DBContext.Provider value={{ db }}>{children}</DBContext.Provider>;
};

export default DBContextProvider;
