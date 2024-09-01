"use client";
import { PomodoroTimer } from "@/components/pomodoro/pomodoroTimer";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

const PomodoroPage = () => {
  const [pomodoroSetupReady, setPomodoroSetupReady] = useState(false);
  const isSetupCalled = useRef(false);

  useEffect(() => {
    if (isSetupCalled.current) return; // Prevents the second call in strict mode

    async function setupPomodoro() {
      try {
        isSetupCalled.current = true;
        console.log("Setting up pomodoro...");
        const response = await axios.post("/api/pomodoro/settings");
        setPomodoroSetupReady(response.data.pomodoroSetup);
      } catch (error) {
        console.error("Failed to setup pomodoro:", error);
      }
    }

    setupPomodoro();
  }, []);

  if (!pomodoroSetupReady) {
    return <div>Loading...</div>;
  }

  return <PomodoroTimer />;
};

export default PomodoroPage;
