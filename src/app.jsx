import { useRef } from "preact/hooks";
import { useAppContext } from "./app-context";
import CurrentMood from "./current-mood";
import MoodStats from "./mood-stats";

export function App() {
  const { moods, user } = useAppContext();
  const today = useRef(new Date());
  const todayMood = moods.find((mood) => {
    const moodDate = new Date(mood.date);
    return today.current.setHours(0, 0, 0, 0) === moodDate.setHours(0, 0, 0, 0);
  });
  return (
    <div className="flex flex-col w-full min-h-screen p-4 bg-purple-50">
      <header className="flex items-center gap-4">
        <img src="/icon.png" height="48" width="48" />
        <p className="text-xl font-bold">Mood Tracker</p>
      </header>
      {user === null && <p>Loading...</p>}
      {user !== null && (
        <main className="flex flex-col w-full">
          <div className="self-center text-center flex flex-col gap-2">
            <h1 className="font-bold text-lg text-blue-500">
              Hello, {user.name}
            </h1>
            <h2 className="text-2xl font-bold">How are you feeling today?</h2>
            <p className="text-gray-400">{today.current.toDateString()}</p>
          </div>
          <div className="my-4">
            <CurrentMood mood={todayMood} />
          </div>
          <div className="my-2">
            <MoodStats moods={moods.slice(0, 5)} />
          </div>
        </main>
      )}
    </div>
  );
}
