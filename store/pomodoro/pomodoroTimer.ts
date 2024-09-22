import { create } from "zustand";

type State = {
  timer: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  isRunning: boolean;
  isPaused: boolean;
  isStopped: boolean;
  isComplete: boolean;
  currentMode: string;
  pomodorosCompleted: number;
  shortBreaksCompleted: number;
  longBreaksCompleted: number;
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  pomodoroBeforeLongBreak: number;
};

type Actions = {
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  completeTimer: () => void;
  resetTimer: () => void;
  decrementTimer: () => void;
  setTimerHours: (hours: number) => void;
  setTimerMinutes: (minutes: number) => void;
  setTimerSeconds: (seconds: number) => void;
  incrementPomodoros: () => void;
  incrementShortBreaks: () => void;
  incrementLongBreaks: () => void;
  setTimerMode: (mode: string) => void;
  updateTimerMode: () => void;
  setTimerDurationAfterModeChange: (mode: string) => void;
  setPomodoroDuration: (duration: number) => void;
  setShortBreakDuration: (duration: number) => void;
  setLongBreakDuration: (duration: number) => void;
  setPomodoroBeforeLongBreak: (pomodoroBeforeLongBreak: number) => void;
};

type PomodoroTimerStore = State & Actions;

const usePomodoroTimerStore = create<PomodoroTimerStore>((set) => ({
  timer: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  isRunning: false,
  isPaused: false,
  isStopped: false,
  isComplete: false,
  currentMode: "pomodoro",
  pomodorosCompleted: 0,
  shortBreaksCompleted: 0,
  longBreaksCompleted: 0,
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  pomodoroBeforeLongBreak: 4,

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
      timer: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      isRunning: false,
      isPaused: false,
      isStopped: false,
      isComplete: false,
      currentMode: "pomodoro",
    })),

  decrementTimer: () =>
    set((state: PomodoroTimerStore) => ({
      timer: {
        hours: state.timer.hours,
        minutes: state.timer.minutes,
        seconds: state.timer.seconds - 1,
      },
    })),

  setTimerDurationAfterModeChange: (mode: string) => {
    set((state: PomodoroTimerStore) => {
      if (mode === "pomodoro") {
        state.setTimerHours(Math.floor(state.pomodoroDuration / 60));
        state.setTimerMinutes(Math.floor(state.pomodoroDuration % 60));
        state.setTimerSeconds(0);
      } else if (mode === "shortBreak") {
        state.setTimerHours(Math.floor(state.shortBreakDuration / 60));
        state.setTimerMinutes(Math.floor(state.shortBreakDuration % 60));
        state.setTimerSeconds(0);
      } else if (mode === "longBreak") {
        state.setTimerHours(Math.floor(state.longBreakDuration / 60));
        state.setTimerMinutes(Math.floor(state.longBreakDuration % 60));
        state.setTimerSeconds(0);
      }
      return {};
    });
  },

  updateTimerMode: () =>
    set((state: PomodoroTimerStore) => {
      const { currentMode, pomodorosCompleted, pomodoroBeforeLongBreak } =
        state;

      let nextPhase;
      nextPhase =
        currentMode === "pomodoro"
          ? pomodoroBeforeLongBreak - pomodorosCompleted === 0
            ? "longBreak"
            : "shortBreak"
          : "pomodoro";

      state.setTimerDurationAfterModeChange(nextPhase);

      return {
        pomodorosCompleted:
          currentMode === "pomodoro"
            ? state.pomodorosCompleted + 1
            : state.pomodorosCompleted,
        shortBreaksCompleted:
          currentMode === "shortBreak"
            ? state.shortBreaksCompleted + 1
            : state.shortBreaksCompleted,
        longBreaksCompleted:
          currentMode === "longBreak"
            ? state.longBreaksCompleted + 1
            : state.longBreaksCompleted,
        currentMode: nextPhase,
      };
    }),

  setTimerMode: (mode: string) => {
    set((state: PomodoroTimerStore) => {
      console.log("setTimerMode", mode);
      state.setTimerDurationAfterModeChange(mode);
      return {
        currentMode: mode,
      };
    });
  },

  setTimerHours: (hours: number) =>
    set((state: PomodoroTimerStore) => ({
      timer: {
        hours,
        minutes: state.timer.minutes,
        seconds: state.timer.seconds,
      },
    })),

  setTimerMinutes: (minutes: number) =>
    set((state: PomodoroTimerStore) => ({
      timer: {
        hours: state.timer.hours,
        minutes,
        seconds: state.timer.seconds,
      },
    })),

  setTimerSeconds: (seconds: number) =>
    set((state: PomodoroTimerStore) => ({
      timer: {
        hours: state.timer.hours,
        minutes: state.timer.minutes,
        seconds,
      },
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

  setPomodoroBeforeLongBreak: (pomodoroBeforeLongBreak: number) =>
    set((state: PomodoroTimerStore) => ({
      pomodoroBeforeLongBreak,
    })),
}));

export { usePomodoroTimerStore as usePomodoroTimer };
export type { PomodoroTimerStore };
