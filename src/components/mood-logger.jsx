import { useEffect, useState } from "preact/hooks";
import { MOODS } from "../enums";
const STEPS = {
  MOOD: 1,
  SLEEP: 2,
};

const MoodLogger = ({ selectedMood, handleClose, handleSubmit }) => {
  const [step, setStep] = useState(STEPS.MOOD);
  const [moodVal, setMoodVal] = useState(selectedMood?.moodVal || 0);
  const [sleep, setSleep] = useState(selectedMood?.sleep || 8);

  const handleSetMood = (newMoodVal) => {
    setMoodVal(Number(newMoodVal));
    setStep(STEPS.SLEEP);
  };

  const handleSaveSleep = () => {
    setStep(STEPS.MOOD);
    setMoodVal(0);
    setSleep(8);
    handleSubmit({
      moodVal,
      sleep,
    });
  };

  const closeLogger = () => {
    setMoodVal(0);
    setSleep(8);
    setStep(STEPS.MOOD);
    handleClose();
  };

  useEffect(() => {
    if (selectedMood) {
      setMoodVal(selectedMood.moodVal);
      setSleep(selectedMood.sleep);
    }
  }, [selectedMood]);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-2">
        <h2 className="font-bold text-2xl p-2 w-3/4">Mood Logger</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 rounded-xl text-white py-2 px-1 w-1/5"
          onClick={closeLogger}
        >
          Close
        </button>
      </div>
      {step === STEPS.MOOD && (
        <div className="flex flex-col gap-2">
          <p className="font-bold text-center text-xl p-2">
            How are you feeling?
          </p>
          {Object.keys(MOODS).map((key, i) => {
            const mood = MOODS[key];
            return (
              <div key={`mood-${i}`} className="flex">
                <button
                  className={` ${mood.bgColor} ${selectedMood?.moodVal === Number(key) ? "border-purple-600" : ""}  hover:opacity-100 opacity-95 hover:border-purple-600 border-4 shadow-xl  w-full flex text-left pl-30 text-white font-bold text-2xl py-4 rounded-xl`}
                  onClick={() => handleSetMood(key)}
                >
                  {mood.title} {mood.emoji}
                </button>
              </div>
            );
          })}
        </div>
      )}
      {step === STEPS.SLEEP && (
        <div className="flex flex-col gap-6">
          <p className="font-bold text-center text-xl p-2">
            How many hours of sleep did you get?
          </p>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="sleep"
              className="text-xl self-center font-bold py-4"
            >
              {" "}
              {sleep} {`Hour${sleep !== 1 ? "s" : ""}`}
            </label>
            <input
              id="sleep"
              type="range"
              value={sleep}
              min={0}
              max={12}
              step={1}
              onChange={(ev) => setSleep(Number(ev.target.value))}
            />
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 w-1/3 text-xl rounded-xl text-white font-bold px-2 py-4 self-center"
            onClick={handleSaveSleep}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodLogger;
