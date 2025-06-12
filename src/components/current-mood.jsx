import { useEffect, useState } from "preact/hooks";
import { MOODS } from "../enums";
const api_url = "http://api.quotable.io/quotes/random";

const CurrentMood = ({ mood, handleAddMood, handleAddReflection }) => {
  const [quote, setQuote] = useState("");
  const [reflection, setReflection] = useState("");

  const loadQuote = async () => {
    try {
      const response = await fetch(api_url);
      const data = await response.json();
      setQuote(data[0].content);
    } catch (_) {
      setQuote("");
    }
  };

  const saveReflection = () => {
    if (reflection === "") return;
    setReflection("");
    handleAddReflection({
      moodId: mood.id,
      reflection,
    });
  };
  useEffect(() => {
    loadQuote();
  }, []);

  if (!mood) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div
          className="flex flex-col items-center justify-center bg-white rounded-3xl text-center py-4 gap-2 px-2 shadow-lg"
          style={{
            minHeight: "300px",
          }}
        >
          <p className="text-3xl font-bold">Add your mood for today</p>
          <button
            className="w-20 h-20 bg-blue-600 hover:bg-blue-700s rounded-full text-white font-bold text-4xl"
            onClick={handleAddMood}
            aria-label="Add mood"
          >
            +
          </button>
        </div>
      </div>
    );
  }
  const currentMood = MOODS[mood.moodVal];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col bg-white rounded-3xl text-center py-4 gap-2 px-2 shadow-lg">
        <p className="text-gray-400 text-3xl">I'm feeling</p>
        <p className={`font-bold text-6xl ${currentMood.textColor}`}>
          {currentMood.title}
        </p>
        <p className="text-9xl my-8">{currentMood.emoji}</p>
        <p className="text-5xl">❝</p>
        <p className="italic text-lg  lg:text-3xl">"{quote}"</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col justify-center bg-white rounded-3xl py-4 gap-2 px-4 lg:w-1/2 shadow-lg">
          <div className="flex items-center gap-2">
            <p
              style={{
                color: "transparent",
                textShadow: "0 0 0 gray",
              }}
            >
              💤
            </p>
            <p className="text-gray-400 font-bold text-lg">Sleep</p>
          </div>

          <p className="text-4xl font-bold">
            {mood.sleep} Hour{mood.sleep === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-col justify-center bg-white rounded-3xl py-4 gap-2 px-4 lg:w-1/2 shadow-lg">
          <div className="flex items-center gap-2">
            <p
              style={{
                color: "transparent",
                textShadow: "0 0 0 gray",
              }}
            >
              🌟
            </p>
            <p className="text-gray-400 font-bold text-lg">Reflections</p>
          </div>
          <ul className="flex flex-col gap-2">
            {mood.reflections.map((reflection, i) => {
              return <li key={`reflection-${i}`}>{reflection}</li>;
            })}
          </ul>
          <hr
            className="w-full my-2
          "
          />
          <div className="flex gap-4 ">
            <input
              className="p-2 text-lg border-2 rounded-xl w-2/3"
              placeholder="New reflection..."
              aria-label="New reflection"
              onChange={(ev) => setReflection(ev?.target?.value)}
              value={reflection}
              max={40}
            />
            <button
              className="bg-blue-400 font-bold text-white w-1/3 rounded-xl"
              onClick={saveReflection}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentMood;
