"use client";
import Popup from "@/components/Popup";
import { Button } from "@/components/ui/button";
import { useFocusMode } from "@/store/pomodoro/focusMode";
import { usePomodoroTimer } from "@/store/pomodoro/pomodoroTimer";
import { usePopup } from "@/store/popup";
import { useEffect, useState } from "react";
import { FaArrowRotateRight } from "react-icons/fa6";
import { RiSettings4Fill } from "react-icons/ri";
import { TbFocus } from "react-icons/tb";
import PomodoroSettings from "./pomodoroSettings";

export const PomodoroTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const [
    timer,
    currentMode,
    pomodoroDuration,
    shortBreakDuration,
    longBreakDuration,
    pomodoroTheme,
    setTimerMode,
    updateTimerMode,
    setTimerHours,
    setTimerMinutes,
    setTimerSeconds,
  ] = usePomodoroTimer((state) => [
    state.timer,
    state.currentMode,
    state.pomodoroDuration,
    state.shortBreakDuration,
    state.longBreakDuration,
    state.pomodoroTheme,
    state.setTimerMode,
    state.updateTimerMode,
    state.setTimerHours,
    state.setTimerMinutes,
    state.setTimerSeconds,
  ]);

  const [popUpVisible, openPopUp, closePopUp] = usePopup((state) => [
    state.isOpen,
    state.open,
    state.close,
  ]);

  const [focusModeEnabled, enableFocusMode, disableFocusMode] = useFocusMode(
    (state) => [state.isEnabled, state.enableFocusMode, state.disableFocusMode],
  );

  const toggleStartPause = () => {
    isActive ? handlePause() : handleStart();
  };

  const handleStart = () => {
    if (timer.hours === 0 && timer.minutes === 0 && timer.seconds === 0) {
      return;
    }
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsActive(false);
  };

  const sessionCompleted = () => {
    console.log("Session completed");
    updateTimerMode();
  };

  const megaSessionCompleted = () => {
    console.log("Mega session completed");
    updateTimerMode();
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimerMode(currentMode);
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500);
  };

  useEffect(() => {
    setTimerMode("pomodoro");
    setIsActive(false);
  }, [pomodoroDuration, shortBreakDuration, longBreakDuration]);

  const timerHandler = () => {
    if (isPaused || !isActive) return;

    if (timer.hours === 0 && timer.minutes === 0 && timer.seconds === 0) {
      updateTimerMode();
    } else if (timer.minutes === 0 && timer.seconds === 0) {
      setTimerHours(timer.hours - 1);
      setTimerMinutes(59);
      setTimerSeconds(59);
    } else if (timer.seconds === 0) {
      setTimerMinutes(timer.minutes - 1);
      setTimerSeconds(59);
    } else {
      setTimerSeconds(timer.seconds - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => timerHandler(), 1000);
    return () => clearInterval(interval);
  }, [isActive, isPaused, timer.hours, timer.minutes, timer.seconds]);

  // Listen for fullscreen change to disable focus mode when exiting fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        disableFocusMode();
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [disableFocusMode]);

  const pomodoroModes = [
    {
      name: "Pomodoro",
      value: "pomodoro",
    },
    {
      name: "Short Break",
      value: "shortBreak",
    },
    {
      name: "Long Break",
      value: "longBreak",
    },
  ];

  console.log("Pomodoro Themes", pomodoroTheme);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-10 overflow-hidden bg-blend-overlay ${
        focusModeEnabled ? "h-[99%]" : "min-h-[calc(100%-5.5rem)]"
      }`}
      style={{
        backgroundImage: `url(${pomodoroTheme})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex gap-5">
        {pomodoroModes.map((mode) => (
          <Button
            key={mode.value}
            className={`w-34 h-10 rounded-md border-2 border-white text-lg font-semibold duration-150 ease-in ${
              currentMode === mode.value
                ? "bg-white text-black hover:bg-white hover:text-black"
                : "bg-transparent text-white hover:bg-white hover:text-black"
            }`}
            onClick={() => setTimerMode(mode.value)}
          >
            {mode.name}
          </Button>
        ))}
      </div>
      <div className="flex items-center justify-center space-x-2 text-center text-8xl font-bold">
        <div className={timer.hours === 0 ? "hidden" : "block"}>
          {timer.hours < 10 ? "0" + timer.hours : timer.hours}:
        </div>
        <div>{timer.minutes < 10 ? "0" + timer.minutes : timer.minutes}:</div>
        <div>{timer.seconds < 10 ? "0" + timer.seconds : timer.seconds}</div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button
          className={
            "h-12 w-32 cursor-pointer rounded-md border-2 border-white bg-white text-2xl text-black duration-150 ease-in hover:bg-transparent hover:text-white"
          }
          onClick={() => toggleStartPause()}
        >
          {isActive ? "Pause" : "Start"}
        </Button>
        <FaArrowRotateRight
          onClick={() => handleReset()}
          size={42}
          className={`cursor-pointer ${isSpinning ? "animate-spin-faster" : ""}`}
        />
        <RiSettings4Fill
          size={46}
          className="cursor-pointer"
          onClick={() => {
            openPopUp();
          }}
        />
      </div>
      <TbFocus
        size={46}
        className={`cursor-pointer transition-all duration-200 ease-in ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => {
          if (focusModeEnabled) {
            disableFocusMode();
            document.exitFullscreen();
          } else {
            enableFocusMode();
            document.fullscreenEnabled &&
              document.documentElement.requestFullscreen();
          }
        }}
      />
      {popUpVisible && (
        <Popup isOpen={popUpVisible} onClose={() => closePopUp()}>
          <PomodoroSettings />
        </Popup>
      )}
    </div>
  );
};
