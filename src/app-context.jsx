import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
const AppContext = createContext({});
import { useDBContext } from "./db-context";
import { ulid } from "ulid";
export const useAppContext = () => useContext(AppContext);

const randomInteger = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const AppContextProvider = ({ children }) => {
  const [dummyMode, setDummyMode] = useState(true);
  const [moods, setMoods] = useState(null);
  const { loadMoodsFromStore, addMoodToStore, updateMoodInStore } =
    useDBContext();

  const loadData = async () => {
    if (dummyMode) {
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
      setMoods(randomMoods);
    } else {
      const data = await loadMoodsFromStore();
      if (data) {
        setMoods(data);
      } else {
        setMoods([]);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [dummyMode]);

  const addNewMood = async (mood) => {
    let update = true;
    if (!dummyMode) {
      update = await addMoodToStore(mood);
    }
    if (update) {
      setMoods((prev) => {
        return [...prev, mood].sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
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
        console.log(newMoods);
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
        }
        return newMoods;
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        dummyMode,
        setDummyMode,
        addNewMood,
        addReflection,
        editMood,
        moods,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
