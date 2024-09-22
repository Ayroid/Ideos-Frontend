import { PomodoroTemplate } from "@/types/pomodoro";
import { create } from "zustand";

type State = {
  templates: PomodoroTemplate[];
  activeTemplateId: string | null;
  editingIndex: number | null;
  editFormData: PomodoroTemplate;
};

type Actions = {
  setActiveTemplateId: (templateId: string) => void;
  addTemplate: (template: PomodoroTemplate) => void;
  addAllTemplates: (templates: PomodoroTemplate[]) => void;
  editTemplate: (index: number) => void;
  updateTemplate: (template: PomodoroTemplate) => void;
  updateTemplateId: (previousId: string, templateId: string) => void;
  cancelEdit: () => void;
  saveEdit: () => void;
  deleteTemplate: (index: number) => void;
};

type PomodoroTemplateStore = State & Actions;

const usePomodoroTemplateStore = create<PomodoroTemplateStore>((set) => ({
  templates: [] as PomodoroTemplate[],
  activeTemplateId: null,
  editingIndex: null,
  editFormData: {
    _id: "",
    templateName: "",
    pomodoroDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    pomodoroBeforeLongBreak: 4,
  },

  setActiveTemplateId: (templateId: string) =>
    set((state: PomodoroTemplateStore) => ({
      activeTemplateId: templateId,
    })),

  addTemplate: (template: PomodoroTemplate) =>
    set((state: PomodoroTemplateStore) => ({
      templates: [...state.templates, template],
    })),

  addAllTemplates: (templates: PomodoroTemplate[]) =>
    set((state: PomodoroTemplateStore) => ({
      templates: templates,
    })),

  editTemplate: (index: number) =>
    set((state: PomodoroTemplateStore) => ({
      editingIndex: index,
      editFormData: { ...state.templates[index] },
    })),

  updateTemplate: (template: PomodoroTemplate) =>
    set((state: PomodoroTemplateStore) => ({
      editFormData: { ...state.editFormData, ...template },
    })),

  updateTemplateId: (previousId: string, templateId: string) =>
    set((state: PomodoroTemplateStore) => ({
      templates: state.templates.map((template) =>
        template._id === previousId
          ? { ...template, _id: templateId }
          : template,
      ),
    })),

  cancelEdit: () =>
    set((state: PomodoroTemplateStore) => ({
      editingIndex: null,
    })),

  saveEdit: () =>
    set((state: PomodoroTemplateStore) => {
      const updatedTemplates = [...state.templates];
      updatedTemplates[state.editingIndex!] = state.editFormData;
      return {
        templates: updatedTemplates,
        editingIndex: null,
      };
    }),

  deleteTemplate: (index: number) =>
    set((state: PomodoroTemplateStore) => {
      if (state.templates.length > 1) {
        return {
          templates: state.templates.filter((_, i) => i !== index),
        };
      }
      return state;
    }),
}));

export { usePomodoroTemplateStore as usePomodoroTemplate };
export type { PomodoroTemplateStore };
