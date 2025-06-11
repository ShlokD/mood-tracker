import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
const AppContext = createContext({});

export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }) => {
  const [dummyMode, setDummyMode] = useState(true);
  const [moods, setMoods] = useState([]);
  const [user, setUser] = useState(null);

  const loadDummyData = async () => {
    if (dummyMode) {
      const data = await import("./dummy-data.json");
      setMoods(data.moods);
      setUser(data.user);
    } else {
      setMoods([]);
      setUser({});
    }
  };

  useEffect(() => {
    loadDummyData();
  }, []);

  return (
    <AppContext.Provider value={{ dummyMode, setDummyMode, moods, user }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
