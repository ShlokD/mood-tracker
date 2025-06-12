import { useEffect, useRef, useState } from "preact/hooks";
import { ulid } from "ulid";
import { useAppContext } from "./app-context";
import CurrentMood from "./components/current-mood";
import MoodLogger from "./components/mood-logger";
import MoodStats from "./components/mood-stats";

export default function App() {
  const [showLogger, setShowLogger] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    dummyMode,
    setDummyMode,
    moods,
    addNewMood,
    addReflection,
    editMood,
  } = useAppContext();
  const today = useRef(new Date());
  const todayMood = moods?.find((mood) => {
    const moodDate = new Date(mood.date);
    return today.current.setHours(0, 0, 0, 0) === moodDate.setHours(0, 0, 0, 0);
  });

  const saveDetails = ({ moodVal, sleep }) => {
    if (!todayMood) {
      const newMood = {
        id: ulid(),
        date: new Date().toISOString(),
        moodVal,
        sleep,
        reflections: [],
      };
      addNewMood(newMood);
    }

    if (editMode) {
      const updatedMood = {
        ...todayMood,
        moodVal,
        sleep,
      };
      editMood(updatedMood);
      setEditMode(false);
    }

    setShowLogger(false);
  };

  const openEditMood = () => {
    setShowLogger(true);
    setEditMode(true);
  };

  useEffect(() => {
    if (showLogger) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showLogger]);

  const showMoodLogger = () => {
    setShowLogger(true);
  };

  const toggleDummyMode = () => setDummyMode((prev) => !prev);

  return (
    <div
      className={`flex flex-col w-full p-4 min-h-screen bg-purple-50 ${showLogger ? "overscroll-y-contain" : ""}`}
    >
      <header className="flex justify-evenly items-center gap-4 w-full">
        <div className="flex items-center w-2/3 gap-4">
          <img src="/icon.png" height="48" width="48" />
          <p className="text-xl font-bold">Mood Tracker</p>
        </div>
        <div className="flex gap-2 w-1/3">
          <label
            htmlFor="dummy"
            className={`font-bold border-4 p-6 rounded-full text-lg ${dummyMode ? "bg-green-400 text-white" : "bg-white"} transition-background-color ease-in-out duration-150 cursor-pointer`}
          >
            Dummy Mode
          </label>
          <input
            id="dummy"
            type="checkbox"
            checked={dummyMode}
            onChange={toggleDummyMode}
            className="hidden"
          />
        </div>
      </header>
      {moods === null && <p>Loading...</p>}
      {moods !== null && (
        <main className="flex flex-col w-full">
          <div className="self-center text-center flex flex-col gap-2">
            <h1 className="font-bold text-lg text-blue-500">Hello</h1>
            <h2 className="text-2xl font-bold">How are you feeling today?</h2>
            <p className="text-gray-400">{today.current.toDateString()}</p>
          </div>
          <div className="mt-4 mb-8 flex gap-2  flex-col items-center">
            <CurrentMood
              mood={todayMood}
              handleAddMood={showMoodLogger}
              handleAddReflection={addReflection}
            />
            {todayMood && (
              <button
                className="py-4 px-2 my-4 rounded-xl text-white bg-blue-400 font-bold w-2/5 "
                onClick={openEditMood}
              >
                Edit
              </button>
            )}
            <hr className="w-full" />
          </div>
          {moods?.length > 0 && (
            <div className="my-2">
              <MoodStats moods={moods.slice(0, 5)} />
            </div>
          )}

          <div className="flex flex-col justify-center items-center">
            <div
              className={`border-2 bottom-0 left-0 lg:bottom-auto lg:top-0 lg:left-[16.6%] lg:top-[20%] bg-white z-10 w-full lg:w-2/3 fixed rounded-lg shadow-xl p-4 ${showLogger ? "visible translate-y-[0px]" : "invisible translate-y-[600px] lg:translate-y-[0px]"} transition-transform duration-500 ease-in-out`}
              style={{
                height: "600px",
              }}
            >
              <MoodLogger
                selectedMood={todayMood}
                handleClose={() => setShowLogger(false)}
                handleSubmit={({ moodVal, sleep }) =>
                  saveDetails({ moodVal, sleep })
                }
              />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
