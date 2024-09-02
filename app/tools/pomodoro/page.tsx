"use client";
import { PomodoroTimer } from "@/components/pomodoro/pomodoroTimer";
import {
  PomodoroTemplateStore,
  usePomodoroTemplate,
} from "@/store/pomodoro/pomodoroTemplates";
import { usePomodoroTimer } from "@/store/pomodoro/pomodoroTimer";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

const PomodoroPage = () => {
  const [templates, activeTemplateId, setActiveTemplateId, addAllTemplates] =
    usePomodoroTemplate((state: PomodoroTemplateStore) => [
      state.templates,
      state.activeTemplateId,
      state.setActiveTemplateId,
      state.addAllTemplates,
    ]);

  const [setPomodoroDuration, setShortBreakDuration, setLongBreakDuration] =
    usePomodoroTimer((state) => [
      state.setPomodoroDuration,
      state.setShortBreakDuration,
      state.setLongBreakDuration,
    ]);

  const [pomodoroSetupReady, setPomodoroSetupReady] = useState(false);
  const isSetupCalled = useRef(false);

  useEffect(() => {
    if (isSetupCalled.current) return; // Prevents the second call in strict mode

    async function setupPomodoro() {
      try {
        isSetupCalled.current = true;
        const response = await axios.post("/api/pomodoro/settings");
        console.log(response.data);
        if (response.status === 201) {
          setPomodoroSetupReady(true);
          addAllTemplates(response.data.userPomodoroTemplateIds);
          setActiveTemplateId(response.data.activePomodoroTemplateId);
          toast.success("Pomodoro Ready!");
        } else if (response.status === 200) {
          setPomodoroSetupReady(true);
          fetchTemplates();
        }
      } catch (error) {
        console.error("Failed to setup pomodoro:", error);
      }
    }

    async function fetchTemplates() {
      const response = await axios.get("/api/pomodoro/settings");
      addAllTemplates(response.data.userPomodoroTemplateIds);
      setActiveTemplateId(response.data.activePomodoroTemplateId);
      toast.success("Pomodoro Ready!");
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
      }
    }
    handleTemplateChange();
  }, [activeTemplateId]);

  if (!pomodoroSetupReady) {
    return <div>Loading...</div>;
  }

  return <PomodoroTimer />;
};

export default PomodoroPage;
