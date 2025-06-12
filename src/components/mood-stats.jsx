import { MOODS } from "../enums";
const MoodStats = ({ moods }) => {
  const totalSleep = moods?.reduce((avgSleep, mood) => {
    avgSleep += mood.sleep;
    return avgSleep;
  }, 0);

  const moodCounter = moods?.reduce(
    (counter, mood) => {
      if (counter[mood.moodVal]) {
        counter[mood.moodVal] += 1;
      } else {
        counter[mood.moodVal] = 1;
      }
      if (counter?.[mood.moodVal] > counter.max.value) {
        counter.max.value = counter[mood.moodVal];
        counter.max.mood = mood.moodVal;
      }
      return counter;
    },
    {
      max: {
        value: -1,
        mood: 0,
      },
    },
  );

  const averageSleep = totalSleep / moods.length;
  const averageMood = MOODS[moodCounter.max.mood];

  const headers = ["Date", "Mood", "Sleep"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-col bg-white rounded-3xl text-center py-4 gap-2 px-2 lg:w-1/2 shadow-lg">
          <div className="flex gap-2 items-baseline">
            <p className="font-bold text-lg text-gray-400">Average Mood</p>
            <p className="text-xs text-gray-300">{`(Last ${moods.length} check-ins)`}</p>
          </div>
          <div
            className={`${averageMood.bgColor} text-white rounded-2xl flex gap-2 p-12 text-3xl items-center`}
          >
            <p className="text-4xl">{averageMood.emoji}</p>
            <p className="text-4xl">{averageMood.title}</p>
          </div>
        </div>
        <div className="flex flex-col bg-white rounded-3xl text-center py-4 gap-2 px-2 lg:w-1/2 shadow-lg">
          <div className="flex gap-2 items-baseline">
            <p className="font-bold text-lg text-gray-400">Average Sleep</p>
            <p className="text-xs text-gray-300">{`(Last ${moods.length} check-ins)`}</p>
          </div>
          <div className="bg-blue-800 text-white rounded-2xl flex gap-2 p-12 text-3xl items-center">
            <p
              style={{
                color: "transparent",
                textShadow: "0 0 0 white",
              }}
            >
              💤
            </p>
            <p className="text-white font-bold text-4xl">
              {Math.floor(averageSleep)} - {Math.ceil(averageSleep)} Hours
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-white rounded-3xl text-center py-4 gap-2 px-2">
        <div className="flex gap-2 items-baseline py-12">
          <p className="font-bold text-lg text-gray-400">
            Mood and Sleep Stats
          </p>
        </div>
        <table className="flex flex-col text-xl lg:text-4xl">
          <thead className="flex ">
            {headers.map((header, i) => {
              return (
                <tr className="w-1/3 flex justify-center" key={`th-${i}`}>
                  <th className="text-center">{header}</th>
                </tr>
              );
            })}
          </thead>
          <tbody className="flex flex-col py-6 gap-4">
            {moods.map((mood, i) => {
              const moodData = MOODS[mood.moodVal];
              return (
                <tr
                  key={`tr-${i}`}
                  className={`flex py-8 ${moodData.bgColor} text-white font-bold rounded-4xl shadow-lg`}
                >
                  <td className="w-1/3">
                    {new Date(mood.date).toLocaleDateString()}
                  </td>
                  <td className="w-1/3 text-2xl lg:text-5xl">
                    {moodData.emoji}
                  </td>
                  <td className="w-1/3">
                    <progress
                      className="w-1/2"
                      value={mood.sleep}
                      min={0}
                      max={12}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoodStats;
