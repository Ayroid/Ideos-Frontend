import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
  PomodoroTemplateStore,
  usePomodoroTemplate,
} from "@/store/pomodoro/pomodoroTemplates";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { toast } from "sonner";
import { Button } from "../ui/button";
import axios from "axios";
import { usePomodoroTimer } from "@/store/pomodoro/pomodoroTimer";

const PomodoroTemplates = () => {
  const [
    templates,
    activeTemplateId,
    editingIndex,
    editFormData,
    setActiveTemplateId,
    addTemplate,
    editTemplate,
    updateTemplate,
    updateTemplateId,
    cancelEdit,
    saveEdit,
    deleteTemplate,
  ] = usePomodoroTemplate((state: PomodoroTemplateStore) => [
    state.templates,
    state.activeTemplateId,
    state.editingIndex,
    state.editFormData,
    state.setActiveTemplateId,
    state.addTemplate,
    state.editTemplate,
    state.updateTemplate,
    state.updateTemplateId,
    state.cancelEdit,
    state.saveEdit,
    state.deleteTemplate,
  ]);

  const [
    setPomodoroDuration,
    setShortBreakDuration,
    setLongBreakDuration,
    setSessionsBeforeLongBreak,
  ] = usePomodoroTimer((state) => [
    state.setPomodoroDuration,
    state.setShortBreakDuration,
    state.setLongBreakDuration,
    state.setSessionsBeforeLongBreak,
  ]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("handleFormChange", name, value);
    if (name === "templateName") {
      updateTemplate({ ...editFormData, [name]: value });
    } else {
      updateTemplate({ ...editFormData, [name]: Number(value) });
    }
  };

  const handleTemplateChange = async (template_id: string) => {
    setActiveTemplateId(template_id);
    const response = await axios.post("/api/pomodoro/settings/activeTemplate", {
      template_id,
    });
    if (response.status === 200) {
      toast.success("Template changed!");
    } else {
      toast.error("Failed to change template");
    }
  };

  const handleTemplateUpdate = async (template_id: string) => {
    saveEdit();
    const previousId = editFormData._id;
    if (parseInt(template_id) <= 5) {
      const response = await axios.post("/api/pomodoro/templates", {
        ...editFormData,
      });
      if (response.status === 200) {
        updateTemplateId(previousId, response.data._id);
        toast.success("Template created!");
      } else {
        toast.error("Failed to create template");
      }
    } else {
      setPomodoroDuration(editFormData.pomodoroDuration);
      setShortBreakDuration(editFormData.shortBreakDuration);
      setLongBreakDuration(editFormData.longBreakDuration);
      setSessionsBeforeLongBreak(editFormData.sessionsBeforeLongBreak);
      const response = await axios.put(
        `/api/pomodoro/templates/${template_id}`,
        {
          ...editFormData,
        },
      );
      if (response.status === 200) {
        toast.success("Template updated!");
      } else {
        toast.error("Failed to update template");
      }
    }
  };

  const handleDeleteTemplate =
    (template_id: string, index: number) => async () => {
      console.log("activeTemplateId", activeTemplateId);

      if (activeTemplateId === template_id) {
        toast.error("Cannot delete active template");
        return;
      }

      if (templates.length <= 1) {
        toast.error("Cannot delete last template");
        return;
      }

      deleteTemplate(index);
      const response = await axios.delete(
        `/api/pomodoro/templates/${template_id}`,
      );
      if (response.status === 200) {
        toast.success("Template deleted!");
      } else {
        toast.error("Failed to delete template");
      }
    };

  return (
    <div className="flex flex-col gap-4 pt-4">
      {templates.map((template, index) => (
        <div
          key={index}
          className="relative flex h-full flex-col gap-2 rounded-md bg-primary-foreground p-4"
        >
          {editingIndex === index ? (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="templateName"
                value={editFormData.templateName}
                onChange={handleFormChange}
                className="rounded-md p-2 text-xl font-semibold"
              />
              <div className="flex items-center justify-between text-sm text-primary/50">
                <div>
                  <input
                    type="number"
                    name="pomodoroDuration"
                    value={editFormData.pomodoroDuration}
                    onChange={handleFormChange}
                    className="no-spinner mr-2 w-10 rounded-md p-2 text-center font-semibold"
                  />
                  |
                  <input
                    type="number"
                    name="shortBreakDuration"
                    value={editFormData.shortBreakDuration}
                    onChange={handleFormChange}
                    className="no-spinner mx-2 w-10 rounded-md p-2 text-center font-semibold"
                  />
                  |
                  <input
                    type="number"
                    name="longBreakDuration"
                    value={editFormData.longBreakDuration}
                    onChange={handleFormChange}
                    className="no-spinner mx-2 w-10 rounded-md p-2 text-center font-semibold"
                  />
                  |
                  <input
                    type="number"
                    name="sessionsBeforeLongBreak"
                    value={editFormData.sessionsBeforeLongBreak}
                    onChange={handleFormChange}
                    className="no-spinner ml-2 w-10 rounded-md p-2 text-center font-semibold"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={"destructive"}
                    className="rounded-md px-4"
                    onClick={cancelEdit}
                  >
                    <RxCross2 />
                  </Button>
                  <Button
                    className="rounded-md px-4"
                    onClick={() => handleTemplateUpdate(template._id)}
                  >
                    <FaCheck />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold">{template.templateName}</h2>
              <div className="flex text-sm text-primary/50">
                Session = ({template.pomodoroDuration} +{" "}
                {template.shortBreakDuration}) x 1
              </div>
              <div className="flex text-sm text-primary/50">
                Mega Session = Session x {template.sessionsBeforeLongBreak}{" "}
                + ({template.pomodoroDuration} + {template.longBreakDuration}) x
                1
              </div>
              <div className="absolute right-4 top-4 mt-1 flex gap-1">
                {activeTemplateId === template?._id && <FaCheck />}
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <BsThreeDotsVertical className="cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mr-24">
                    <DropdownMenuItem
                      onClick={() => {
                        handleTemplateChange(template._id);
                      }}
                    >
                      Select
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editTemplate(index)}
                      disabled={parseInt(template._id) <= 5}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500"
                      onClick={handleDeleteTemplate(template._id, index)}
                      disabled={parseInt(template._id) <= 5}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
      ))}
      {templates.length < 5 && (
        <div>
          <button
            className="flex w-full items-center gap-2 rounded-md bg-primary-foreground p-2 text-center"
            onClick={() => {
              addTemplate({
                _id: String(templates.length + 1),
                templateName: "New Template",
                pomodoroDuration: 25,
                shortBreakDuration: 5,
                longBreakDuration: 15,
                sessionsBeforeLongBreak: 4,
              });
              editTemplate(templates.length);
            }}
          >
            <span className="w-full font-semibold text-white">
              New Template
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export { PomodoroTemplates };
