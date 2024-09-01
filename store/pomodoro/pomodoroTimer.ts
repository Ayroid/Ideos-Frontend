import { create } from "zustand";

type State = {
  timer: number;
  isRunning: boolean;
  isPaused: boolean;
  isStopped: boolean;
  isComplete: boolean;
  currentPhase: string;
  pomodorosCompleted: number;
  shortBreaksCompleted: number;
  longBreaksCompleted: number;
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
};

type Actions = {
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  completeTimer: () => void;
  resetTimer: () => void;
  incrementPomodoros: () => void;
  incrementShortBreaks: () => void;
  incrementLongBreaks: () => void;
  setPomodoroDuration: (duration: number) => void;
  setShortBreakDuration: (duration: number) => void;
  setLongBreakDuration: (duration: number) => void;
};

type PomodoroTimerStore = State & Actions;

const usePomodoroTimerStore = create<PomodoroTimerStore>((set) => ({
  timer: 0,
  isRunning: false,
  isPaused: false,
  isStopped: false,
  isComplete: false,
  currentPhase: "pomodoro",
  pomodorosCompleted: 0,
  shortBreaksCompleted: 0,
  longBreaksCompleted: 0,
  pomodoroDuration: 20,
  shortBreakDuration: 5,
  longBreakDuration: 15,

  startTimer: () =>
    set((state: PomodoroTimerStore) => ({
      isRunning: true,
      isPaused: false,
      isStopped: false,
      isComplete: false,
    })),

  pauseTimer: () =>
    set((state: PomodoroTimerStore) => ({
      isPaused: true,
      isRunning: false,
    })),

  stopTimer: () =>
    set((state: PomodoroTimerStore) => ({
      isStopped: true,
      isRunning: false,
      isPaused: false,
    })),

  completeTimer: () =>
    set((state: PomodoroTimerStore) => ({
      isComplete: true,
      isRunning: false,
      isPaused: false,
    })),

  resetTimer: () =>
    set((state: PomodoroTimerStore) => ({
      timer: 0,
      isRunning: false,
      isPaused: false,
      isStopped: false,
      isComplete: false,
      currentPhase: "pomodoro",
    })),

  incrementPomodoros: () =>
    set((state: PomodoroTimerStore) => ({
      pomodorosCompleted: state.pomodorosCompleted + 1,
    })),

  incrementShortBreaks: () =>
    set((state: PomodoroTimerStore) => ({
      shortBreaksCompleted: state.shortBreaksCompleted + 1,
    })),

  incrementLongBreaks: () =>
    set((state: PomodoroTimerStore) => ({
      longBreaksCompleted: state.longBreaksCompleted + 1,
    })),

  setPomodoroDuration: (duration: number) =>
    set((state: PomodoroTimerStore) => ({
      pomodoroDuration: duration,
    })),

  setShortBreakDuration: (duration: number) =>
    set((state: PomodoroTimerStore) => ({
      shortBreakDuration: duration,
    })),

  setLongBreakDuration: (duration: number) =>
    set((state: PomodoroTimerStore) => ({
      longBreakDuration: duration,
    })),
}));

export { usePomodoroTimerStore as usePomodoroTimer };
export type { PomodoroTimerStore };
