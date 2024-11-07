import React from "react";
import { usePomodoroTimer } from "@/store/pomodoro/pomodoroTimer";
import { Check } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const themes = [
  {
    name: "Japanese",
    imageUrl: "/pomodoro/japanese.png",
    previewImageUrl: "/pomodoro/preview/japanese-preview.jpg",
  },
  {
    name: "Leaves",
    imageUrl: "/pomodoro/leaves.jpg",
    previewImageUrl: "/pomodoro/preview/leaves-preview.jpg",
  },
  {
    name: "Particles",
    imageUrl: "/pomodoro/particles.jpg",
    previewImageUrl: "/pomodoro/preview/particles-preview.jpg",
  },
  {
    name: "Sky",
    imageUrl: "/pomodoro/sky.jpg",
    previewImageUrl: "/pomodoro/preview/sky-preview.jpg",
  },
  {
    name: "Soil",
    imageUrl: "/pomodoro/soil.jpg",
    previewImageUrl: "/pomodoro/preview/soil-preview.jpg",
  },
  {
    name: "Stones",
    imageUrl: "/pomodoro/stones.jpg",
    previewImageUrl: "/pomodoro/preview/stones-preview.jpg",
  },
  {
    name: "Tree",
    imageUrl: "/pomodoro/tree.jpg",
    previewImageUrl: "/pomodoro/preview/tree-preview.jpg",
  },
  {
    name: "Universe",
    imageUrl: "/pomodoro/universe.jpg",
    previewImageUrl: "/pomodoro/preview/universe-preview.jpg",
  },
  {
    name: "Waterfall",
    imageUrl: "/pomodoro/waterfall.jpg",
    previewImageUrl: "/pomodoro/preview/waterfall-preview.jpg",
  },
];

const PomodoroThemes = () => {
  const [pomodoroTheme, setPomodoroTheme] = usePomodoroTimer((state) => [
    state.pomodoroTheme,
    state.setPomodoroTheme,
  ]);

  const handleThemeChange = async (theme: {
    name: string;
    imageUrl: string;
    previewImageUrl: string;
  }) => {
    setPomodoroTheme(theme.imageUrl);
    const response = await axios.post("/api/pomodoro/settings/activeTheme", {
      theme: theme.imageUrl,
    });
    if (response.status === 200) {
      toast.success("Theme updated!");
    } else {
      toast.error("Failed to update theme");
    }
  };

  return (
    <div className="flex h-full max-h-[80vh] flex-col overflow-hidden">
      <h2 className="p-4 text-2xl font-bold">Choose a Theme</h2>
      <div className="flex-grow overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <div
              key={theme.name}
              className={`relative cursor-pointer overflow-hidden rounded-lg shadow-lg transition-all duration-300 ${
                pomodoroTheme === theme.imageUrl ? "ring-4 ring-blue-500" : ""
              }`}
              onClick={() => handleThemeChange(theme)}
            >
              <img
                src={theme.previewImageUrl}
                alt={theme.name}
                className="h-48 w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white">
                {theme.name}
              </div>
              {pomodoroTheme === theme.imageUrl && (
                <div className="absolute right-2 top-2 rounded-full bg-blue-500 p-1">
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
