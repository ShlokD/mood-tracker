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
  const loadMoodsFromStore = async () => {
    try {
      const data = await db.moods.limit(5).toArray();
      return data;
    } catch (_) {
      return [];
    }
  };

  const addMoodToStore = async (mood) => {
    try {
      await db.moods.add(mood);
      return true;
    } catch (_) {
      return false;
    }
  };

  const updateMoodInStore = async (mood) => {
    try {
      await db.moods.put(mood);
      return true;
    } catch (_) {
      return false;
    }
  };

  const deleteMoodsFromStore = async () => {
    try {
      await db.moods.clear();
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <DBContext.Provider
      value={{
        loadMoodsFromStore,
        addMoodToStore,
        updateMoodInStore,
        deleteMoodsFromStore,
      }}
    >
      {children}
    </DBContext.Provider>
  );
};

export default DBContextProvider;
