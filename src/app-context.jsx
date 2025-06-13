import { createContext } from "preact";
import { useContext, useEffect, useState, useRef } from "preact/hooks";
const AppContext = createContext({});
import { useDBContext } from "./db-context";
import { ulid } from "ulid";
export const useAppContext = () => useContext(AppContext);

const randomInteger = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const AppContextProvider = ({ children }) => {
  const [dummyMode, setDummyMode] = useState(false);
  const [moods, setMoods] = useState(null);
  const {
    loadMoodsFromStore,
    addMoodToStore,
    updateMoodInStore,
    deleteMoodsFromStore,
  } = useDBContext();

  const dummyData = useRef([]);

  const loadDataFromStore = async () => {
    const data = await loadMoodsFromStore();
    if (data.length > 0) {
      setMoods(data);
      return true;
    }

    return false;
  };

  const loadDummyData = () => {
    const today = new Date();
    const randomMoods = new Array(5).fill(0).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - i - 1);
      return {
        id: ulid(),
        date: d.toISOString(),
        moodVal: randomInteger(1, 5),
        sleep: randomInteger(0, 12),
        reflections: [],
      };
    });
    dummyData.current = randomMoods;
  };

  const loadData = async () => {
    const fromStore = await loadDataFromStore();
    if (fromStore) {
      setDummyMode(false);
    } else {
      setDummyMode(true);
      setMoods(dummyData.current);
    }
  };

  useEffect(() => {
    loadDummyData();
    loadData();
  }, []);

  const toggleDummyMode = async () => {
    if (dummyMode) {
      const inStore = await loadDataFromStore();
      if (!inStore) {
        setMoods([]);
      }
      setDummyMode(false);
    } else {
      setMoods(dummyData.current);
      setDummyMode(true);
    }
  };

  const addNewMood = async (mood) => {
    let update = true;
    if (!dummyMode) {
      update = await addMoodToStore(mood);
    }
    if (update) {
      setMoods((prev) => {
        const newMoods = [...prev, mood].sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        if (dummyMode) {
          dummyData.current = newMoods;
        }
        return newMoods;
      });
    }
  };

  const editMood = async (updatedMood) => {
    let update = true;
    if (!dummyMode) {
      update = await updateMoodInStore(updatedMood);
    }
    if (update) {
      setMoods((prev) => {
        const newMoods = [...prev];
        const index = newMoods.findIndex((m) => m.id === updatedMood.id);
        newMoods[index] = updatedMood;
        if (dummyMode) {
          dummyData.current = newMoods;
        }
        return newMoods;
      });
    }
  };

  const addReflection = async ({ moodId, reflection }) => {
    const editedMood = moods.find((m) => m.id === moodId);
    let update = true;
    if (!dummyMode) {
      update = await updateMoodInStore({
        ...editedMood,
        reflections: [...editedMood.reflections, reflection],
      });
    }

    if (update) {
      setMoods((prev) => {
        const newMoods = [...prev];
        let moodToEdit = newMoods.find((m) => m.id === moodId);
        if (moodToEdit) {
          const index = newMoods.findIndex((m) => m.id === moodId);
          moodToEdit = {
            ...moodToEdit,
            reflections: [...moodToEdit.reflections, reflection],
          };
          newMoods[index] = moodToEdit;
          if (dummyMode) {
            dummyData.current = newMoods;
          }
        }
        return newMoods;
      });
    }
  };

  const deleteMoodData = async () => {
    try {
      await deleteMoodsFromStore();
      setMoods([]);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        dummyMode,
        addNewMood,
        addReflection,
        editMood,
        deleteMoodData,
        moods,
        toggleDummyMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
