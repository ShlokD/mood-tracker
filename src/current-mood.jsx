import { useEffect, useState } from "preact/hooks";
import { MOODS } from "./enums";
const api_url = "http://api.quotable.io/quotes/random";

const CurrentMood = ({ mood }) => {
  const currentMood = MOODS[mood.moodVal];
  const [quote, setQuote] = useState("");

  const loadQuote = async () => {
    const response = await fetch(api_url);
    const data = await response.json();
    setQuote(data[0].content);
  };
  useEffect(() => {
    loadQuote();
  }, []);
  return (
    <div className="flex flex-col gap-4">
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
        <div className="flex flex-col bg-white rounded-3xl py-4 gap-2 px-2 lg:w-1/2 shadow-lg">
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
        <div className="flex flex-col bg-white rounded-3xl py-4 gap-2 px-2 lg:w-1/2 shadow-lg">
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
        </div>
      </div>
    </div>
  );
};

export default CurrentMood;
