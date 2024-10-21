import React from "react";
import { usePomodoroTimer } from "@/store/pomodoro/pomodoroTimer";
import { Check } from "lucide-react";

const themes = [
  { name: "Forest", imageUrl: "/api/placeholder/300/200" },
  { name: "Ocean", imageUrl: "/api/placeholder/300/200" },
  { name: "Mountain", imageUrl: "/api/placeholder/300/200" },
  { name: "Desert", imageUrl: "/api/placeholder/300/200" },
  { name: "Space", imageUrl: "/api/placeholder/300/200" },
];

const PomodoroThemes = () => {
  const [
    pomodoroTheme,
    setPomodoroTheme
  ] = usePomodoroTimer((state) => [
    state.pomodoroTheme,
    state.setPomodoroTheme
  ]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Choose a Theme</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {themes.map((item) => (
          <div
            key={item.name}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
              pomodoroTheme === item.name ? "ring-4 ring-blue-500" : ""
            }`}
            onClick={() => setPomodoroTheme(item.name)}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              {item.name}
            </div>
            {pomodoroTheme === item.name && (
              <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                <Check size={16} color="white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PomodoroThemes;