"use client";
import Loading from "@/components/Loading";
import { PomodoroTimer } from "@/components/pomodoro/pomodoroTimer";
import {
  PomodoroTemplateStore,
  usePomodoroTemplate,
} from "@/store/pomodoro/pomodoroTemplates";
import { usePomodoroTimer } from "@/store/pomodoro/pomodoroTimer";
import { PomodoroTemplate } from "@/types/pomodoro";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

const PomodoroPage = () => {
  const [templates, addAllTemplates] = usePomodoroTemplate(
    (state: PomodoroTemplateStore) => [state.templates, state.addAllTemplates],
  );

  const [
    setPomodoroDuration,
    setShortBreakDuration,
    setLongBreakDuration,
    setSessionsBeforeLongBreak,
    activeTemplateId,
    setActiveTemplateId,
    pomodoroTheme,
    setPomodoroTheme,
  ] = usePomodoroTimer((state) => [
    state.setPomodoroDuration,
    state.setShortBreakDuration,
    state.setLongBreakDuration,
    state.setSessionsBeforeLongBreak,
    state.activeTemplateId,
    state.setActiveTemplateId,
    state.pomodoroTheme,
    state.setPomodoroTheme,
  ]);

  const [pomodoroSetupReady, setPomodoroSetupReady] = useState(false);
  const isSetupCalled = useRef(false);

  useEffect(() => {
    if (isSetupCalled.current) return; // Prevents the second call in strict mode

    async function setupPomodoro() {
      try {
        isSetupCalled.current = true;
        const response = await axios.post("/api/pomodoro/settings");
        if (response.status === 201 || response.status === 200) {
          const data = response.data;
          addAllTemplates(data.userPomodoroTemplateIds);
          setActiveTemplateId(data.activePomodoroTemplateId);
          setPomodoroTheme(data.activePomodoroTheme);
          setPomodoroSetupReady(true);
          toast.success("Pomodoro Ready!");
        }
      } catch (error) {
        console.error("Failed to setup pomodoro:", error);
      }
    }

    setupPomodoro();
  }, []);

  useEffect(() => {
    function handleTemplateChange() {
      const selectedTemplate = templates.find(
        (template) => template._id === activeTemplateId,
      );
      if (selectedTemplate) {
        setPomodoroDuration(selectedTemplate.pomodoroDuration);
        setShortBreakDuration(selectedTemplate.shortBreakDuration);
        setLongBreakDuration(selectedTemplate.longBreakDuration);
        setSessionsBeforeLongBreak(selectedTemplate.sessionsBeforeLongBreak);
      }
    }
    handleTemplateChange();
  }, [activeTemplateId]);

  if (!pomodoroSetupReady) {
    return <Loading />;
  }

  return <PomodoroTimer />;
};

export default PomodoroPage;
