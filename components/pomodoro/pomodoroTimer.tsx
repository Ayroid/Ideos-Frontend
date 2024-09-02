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
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeMode, setActiveMode] = useState("pomodoro");
  const [isSpinning, setIsSpinning] = useState(false);

  const [pomodoroDuration, shortBreakDuration, longBreakDuration] =
    usePomodoroTimer((state) => [
      state.pomodoroDuration,
      state.shortBreakDuration,
      state.longBreakDuration,
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
    if (hours === 0 && minutes === 0 && seconds === 0) {
      return;
    }
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    handleModeChange(activeMode);
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500);
  };

  const handleModeChange = (mode: string) => {
    setActiveMode(mode);
    switch (mode) {
      case "pomodoro":
        setHours(Math.floor(pomodoroDuration / 60));
        setMinutes(Math.floor(pomodoroDuration % 60));
        setSeconds(0);
        break;
      case "short":
        setHours(Math.floor(shortBreakDuration / 60));
        setMinutes(Math.floor(shortBreakDuration % 60));
        setSeconds(0);
        break;
      case "long":
        setHours(Math.floor(longBreakDuration / 60));
        setMinutes(Math.floor(longBreakDuration % 60));
        setSeconds(0);
        break;
    }
  };

  useEffect(() => {
    handleModeChange("pomodoro");
    setIsActive(false);
  }, [pomodoroDuration, shortBreakDuration, longBreakDuration]);

  const tick = () => {
    if (isPaused || !isActive) return;

    if (hours === 0 && minutes === 0 && seconds === 0) {
      handleReset();
    } else if (minutes === 0 && seconds === 0) {
      setHours(hours - 1);
      setMinutes(59);
      setSeconds(59);
    } else if (seconds === 0) {
      setMinutes(minutes - 1);
      setSeconds(59);
    } else {
      setSeconds(seconds - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [isActive, isPaused, hours, minutes, seconds]);

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
      value: "short",
    },
    {
      name: "Long Break",
      value: "long",
    },
  ];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-10 overflow-hidden bg-opacity-30 bg-[url('/pomodoro/image.png')] bg-blend-overlay ${
        focusModeEnabled ? "h-[99%]" : "min-h-[calc(100%-5.5rem)]"
      }`}
    >
      <div className="flex gap-5">
        {pomodoroModes.map((mode) => (
          <Button
            key={mode.value}
            className={`w-34 h-10 rounded-md border-2 border-white text-lg font-semibold duration-150 ease-in ${
              activeMode === mode.value
                ? "bg-white text-black hover:bg-white hover:text-black"
                : "bg-transparent text-white hover:bg-white hover:text-black"
            }`}
            onClick={() => handleModeChange(mode.value)}
          >
            {mode.name}
          </Button>
        ))}
      </div>
      <div className="flex items-center justify-center space-x-2 text-center text-8xl font-bold">
        <div className={hours === 0 ? "hidden" : "block"}>
          {hours < 10 ? "0" + hours : hours}:
        </div>
        <div>{minutes < 10 ? "0" + minutes : minutes}:</div>
        <div>{seconds < 10 ? "0" + seconds : seconds}</div>
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
