import React from "react";
import { usePomodoroTimer } from "@/store/pomodoro/pomodoroTimer";
import { Check } from "lucide-react";

const themes = [
  { name: "Japanese", imageUrl: "/pomodoro/japanese.png", previewImageUrl: "/pomodoro/preview/japanese-preview.jpg" },
  { name: "Leaves", imageUrl: "/pomodoro/leaves.jpg", previewImageUrl: "/pomodoro/preview/leaves-preview.jpg" },
  { name: "Particles", imageUrl: "/pomodoro/particles.jpg", previewImageUrl: "/pomodoro/preview/particles-preview.jpg" },
  { name: "Sky", imageUrl: "/pomodoro/sky.jpg", previewImageUrl: "/pomodoro/preview/sky-preview.jpg" },
  { name: "Soil", imageUrl: "/pomodoro/soil.jpg", previewImageUrl: "/pomodoro/preview/soil-preview.jpg" },
  { name: "Stones", imageUrl: "/pomodoro/stones.jpg", previewImageUrl: "/pomodoro/preview/stones-preview.jpg" },
  { name: "Tree", imageUrl: "/pomodoro/tree.jpg", previewImageUrl: "/pomodoro/preview/tree-preview.jpg" },
  { name: "Universe", imageUrl: "/pomodoro/universe.jpg", previewImageUrl: "/pomodoro/preview/universe-preview.jpg" },
  { name: "Waterfall", imageUrl: "/pomodoro/waterfall.jpg", previewImageUrl: "/pomodoro/preview/waterfall-preview.jpg" }
];

const PomodoroThemes = () => {
  const [pomodoroTheme, setPomodoroTheme] = usePomodoroTimer((state) => [
    state.pomodoroTheme,
    state.setPomodoroTheme
  ]);

  return (
    <div className="flex flex-col h-full max-h-[80vh] overflow-hidden">
      <h2 className="text-2xl font-bold p-4">Choose a Theme</h2>
      <div className="flex-grow overflow-y-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((item) => (
            <div
              key={item.name}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 shadow-lg ${
                pomodoroTheme === item.imageUrl ? "ring-4 ring-blue-500" : ""
              }`}
              onClick={() => setPomodoroTheme(item.imageUrl)}
            >
              <img
                src={item.previewImageUrl}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                {item.name}
              </div>
              {pomodoroTheme === item.imageUrl && (
                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                  <Check size={20} color="white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PomodoroThemes;