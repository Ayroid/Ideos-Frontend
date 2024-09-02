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
import { toast } from "sonner";
import { Button } from "../ui/button";
import axios from "axios";

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
    state.cancelEdit,
    state.saveEdit,
    state.deleteTemplate,
  ]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
                name="name"
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
                    className="mr-2 w-12 rounded-md p-2 font-semibold"
                  />
                  |
                  <input
                    type="number"
                    name="shortBreakDuration"
                    value={editFormData.shortBreakDuration}
                    onChange={handleFormChange}
                    className="mx-2 w-12 rounded-md p-2 font-semibold"
                  />
                  |
                  <input
                    type="number"
                    name="longBreakDuration"
                    value={editFormData.longBreakDuration}
                    onChange={handleFormChange}
                    className="ml-2 w-12 rounded-md p-2 font-semibold"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={"destructive"}
                    className="rounded-md px-4"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </Button>
                  <Button className="rounded-md px-4" onClick={saveEdit}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold">{template.templateName}</h2>
              <div className="flex text-sm text-primary/50">
                {template.pomodoroDuration} | {template.shortBreakDuration} |{" "}
                {template.longBreakDuration}
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
                    <DropdownMenuItem onClick={() => editTemplate(index)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500"
                      onClick={() => {
                        if (templates.length == 1) {
                          toast.error("You must have at least one template");
                        } else {
                          deleteTemplate(index);
                        }
                      }}
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
