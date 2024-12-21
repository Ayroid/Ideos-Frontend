"use client";

import ColumnContainer from "@/components/kanban/ColumnContainer";
import TodoForm from "@/components/kanban/CreateTodoForm";
import Popup from "@/components/Popup";
import Todo from "@/components/kanban/Todo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateUniqueId } from "@/utils/generateId";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ColumnTypes, TodoTypes } from "@/types/kanban";

// ICONS
import { GoPlusCircle } from "react-icons/go";
import { PiKanbanLight } from "react-icons/pi";
import { CgMenuGridR } from "react-icons/cg";

// STATE MANAGEMENT IMPORTS
import FeatureComingSoon from "@/components/FeatureComingSoon";
import TodoColumnDeleteConfirmation from "@/components/kanban/TodoColumnDeleteConfirmation";
import { TodoStore, useTodo } from "@/store/kanban/todo";
import { ColumnStore, useTodoColumn } from "@/store/kanban/todoColumn";
import { usePopup } from "@/store/popup";
import { getRandomColor } from "@/utils/randomColor";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Board {
  id: string;
  title: string;
  isDefault: boolean;
}

const ViewKanbanBoard = () => {
  // STATE MANAGEMENT
  const [
    columns,
    addAllTodoColumns,
    updateTodoColumnName,
    updateTodoColumnOrder,
    deleteTodoColumn,
  ] = useTodoColumn((state: ColumnStore) => [
    state.columns,
    state.addAllTodoColumns,
    state.updateTodoColumnName,
    state.updateTodoColumnOrder,
    state.deleteTodoColumn,
  ]);

  const [
    todos,
    addAllTodos,
    updateTodosOrderOverTodo,
    updateTodosOrderOverColumn,
    deleteAllColumnTodos,
  ] = useTodo((state: TodoStore) => [
    state.todos,
    state.addAllTodos,
    state.updateTodosOrderOverTodo,
    state.updateTodosOrderOverColumn,
    state.deleteAllColumnTodos,
  ]);

  const [popUpVisible, openPopUp, closePopUp] = usePopup((state) => [
    state.isOpen,
    state.open,
    state.close,
  ]);

  // LOADING STATES
  const [columnsLoading, setColumnsLoading] = useState<boolean>(true);
  const [boardsLoading, setBoardsLoading] = useState<boolean>(true);

  // BOARD STATES
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoard, setCurrentBoard] = useState<string>("");

  // ACTIVE STATES
  const [activeTodo, setActiveTodo] = useState<TodoTypes | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnTypes | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [popupType, setPopupType] = useState<"deleteColumn" | "createTodo">();
  const [columnIdToDelete, setColumnIdToDelete] = useState<string | null>(null);

  // OTHER STATES
  const [isClient, setIsClient] = useState(false);

  const { getAccessTokenRaw } = useKindeBrowserClient();
  const accessToken = getAccessTokenRaw();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch boards
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get("/api/kanban/boards");
        const fetchedBoards = response.data;
        setBoards(fetchedBoards);

        // Set current board to default board or first board
        const defaultBoard =
          fetchedBoards.find((b: Board) => b.isDefault) || fetchedBoards[0];
        if (defaultBoard) {
          setCurrentBoard(defaultBoard.id);
        }
      } catch (error) {
        console.error("Error fetching boards:", error);
        toast.error("Error fetching boards");
      } finally {
        setBoardsLoading(false);
      }
    };

    if (accessToken) {
      fetchBoards();
    }
  }, [accessToken]);

  // Fetch columns for current board
  useEffect(() => {
    const fetchColumns = async () => {
      if (!currentBoard) return;

      try {
        setColumnsLoading(true);
        const response = await axios.get(
          `/api/kanban/boards/${currentBoard}/columns`,
        );
        const fetchedColumns = response.data;

        const fetchedTodos = fetchedColumns.reduce(
          (acc: TodoTypes[], col: ColumnTypes) => {
            if (col.todoIds && col.todoIds.length > 0) {
              acc.push(...col.todoIds);
            }
            return acc;
          },
          [],
        );

        addAllTodoColumns(fetchedColumns);
        addAllTodos(fetchedTodos);
      } catch (error) {
        console.error("Error fetching columns:", error);
        toast.error("Error fetching columns");
      } finally {
        setColumnsLoading(false);
      }
    };

    if (accessToken && currentBoard) {
      fetchColumns();
    }
  }, [accessToken, currentBoard]);

  async function updateColumn(
    columnId: string,
    title: string,
    serverUpdate: boolean,
  ) {
    try {
      if (serverUpdate) {
        await axios.put(
          `/api/kanban/boards/${currentBoard}/columns/${columnId}`,
          { title },
        );
        toast.success("Column updated successfully");
      } else {
        updateTodoColumnName(columnId, title);
      }
    } catch (error) {
      console.error("Error updating column:", error);
      toast.error("Error updating column");
    }
  }

  async function deleteColumnCheck(columnId: string) {
    try {
      setColumnIdToDelete(columnId);
      if (todos.filter((t) => t.columnId === columnId).length > 0) {
        setPopupType("deleteColumn");
        openPopUp();
      } else {
        await deleteColumn(columnId);
      }
    } catch (error) {
      console.error("Error checking column deletion:", error);
      toast.error("Error checking column deletion");
    }
  }

  async function deleteColumn(columnId?: string) {
    try {
      const deleteColumnId = columnId ?? columnIdToDelete;
      closePopUp();
      deleteTodoColumn(deleteColumnId!);
      deleteAllColumnTodos(deleteColumnId!);
      await axios.delete(
        `/api/kanban/boards/${currentBoard}/columns/${deleteColumnId}`,
      );
      toast.success("Column deleted successfully");
    } catch (error) {
      console.error("Error deleting column:", error);
      toast.error("Error deleting column");
    }
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    }

    if (event.active.data.current?.type === "Todo") {
      setActiveTodo(event.active.data.current.todo);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTodo(null);

    const { active, over } = event;

    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    updateTodoColumnOrder(String(activeColumnId), String(overColumnId));

    // Update server
    axios
      .put(`/api/kanban/boards/${currentBoard}/columns/reorder`, {
        columnOrders: [
          {
            columnId: String(activeColumnId),
            order: over.data.current?.sortable?.index,
          },
          {
            columnId: String(overColumnId),
            order: active.data.current?.sortable?.index,
          },
        ],
      })
      .catch((error) => {
        console.error("Error updating column order:", error);
        toast.error("Error updating column order");
      });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActivatingTodo = active.data.current?.type === "Todo";
    const isOverTodo = over.data.current?.type === "Todo";

    if (!isActivatingTodo) return;

    if (isActivatingTodo && isOverTodo) {
      updateTodosOrderOverTodo(String(activeId), String(overId));
      // Update server
      axios
        .put(`/api/kanban/boards/${currentBoard}/todos/reorder`, {
          todoOrders: [
            {
              todoId: String(activeId),
              order: over.data.current?.sortable?.index,
            },
            {
              todoId: String(overId),
              order: active.data.current?.sortable?.index,
            },
          ],
        })
        .catch((error) => {
          console.error("Error updating todo order:", error);
          toast.error("Error updating todo order");
        });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActivatingTodo && isOverAColumn) {
      updateTodosOrderOverColumn(String(activeId), String(overId));
      // Update server
      axios
        .put(`/api/kanban/boards/${currentBoard}/todos/${activeId}`, {
          columnId: String(overId),
        })
        .catch((error) => {
          console.error("Error moving todo to column:", error);
          toast.error("Error moving todo to column");
        });
    }
  }

  if (boardsLoading) {
    return (
      <div className="flex h-[65dvh] items-center justify-center">
        <Skeleton className="h-[400px] w-[600px]" />
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="flex h-[65dvh] items-center justify-center">
        <div className="flex flex-col items-center">
          <PiKanbanLight className="h-36 w-36 text-primary" />
          <p className="text-2xl font-bold text-primary">Welcome to Kanban</p>
          <p className="mt-1 text-center text-lg text-primary">
            Create your first board to get started
          </p>
          <Button
            onClick={async () => {
              try {
                const response = await axios.post("/api/kanban/boards", {
                  title: "My First Board",
                  description: "Get started by adding columns and tasks",
                });
                setBoards([response.data]);
                setCurrentBoard(response.data.id);
              } catch (error) {
                console.error("Error creating board:", error);
                toast.error("Error creating board");
              }
            }}
            className="mt-4"
          >
            Create Board
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Select value={currentBoard} onValueChange={setCurrentBoard}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a board" />
          </SelectTrigger>
          <SelectContent>
            {boards.map((board) => (
              <SelectItem key={board.id} value={board.id}>
                {board.title} {board.isDefault && "(Default)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {boards.length < 5 && (
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const response = await axios.post("/api/kanban/boards", {
                  title: "New Board",
                  description: "",
                });
                setBoards([...boards, response.data]);
                setCurrentBoard(response.data.id);
                toast.success("Board created successfully");
              } catch (error) {
                console.error("Error creating board:", error);
                toast.error("Error creating board");
              }
            }}
          >
            <GoPlusCircle className="mr-2 h-4 w-4" /> New Board
          </Button>
        )}
      </div>

      {!columnsLoading && columns.length === 0 && (
        <div className="flex h-[65dvh] items-center justify-center p-10">
          <div className="flex flex-col items-center">
            <PiKanbanLight className="h-36 w-36 text-primary" />
            <p className="text-2xl font-bold text-primary">
              This board is empty
            </p>
            <p className="mt-1 text-center text-lg text-primary">
              Get started by adding a new column
            </p>
          </div>
        </div>
      )}
      <div>
        {columnsLoading ? (
          <div className="mt-10 flex gap-4 overflow-auto">
            <Skeleton className="h-[500px] w-[350px] rounded-lg" />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
          >
            <div className="mt-10 flex gap-4 overflow-auto">
              <SortableContext
                items={columns.map((col: ColumnTypes) => col.uniqueId)}
              >
                {columns.map((col: ColumnTypes) => (
                  <ColumnContainer
                    key={col.uniqueId}
                    column={col}
                    deleteColumn={deleteColumnCheck}
                    updateColumn={updateColumn}
                    setPopUpVisible={(value: boolean) => {
                      value ? openPopUp() : closePopUp();
                      setPopupType("createTodo");
                      setActiveColumnId(col.uniqueId);
                    }}
                    todos={todos.filter((t) => t.columnId === col.uniqueId)}
                    boardId={currentBoard}
                  />
                ))}
              </SortableContext>
            </div>
            {isClient &&
              createPortal(
                <DragOverlay>
                  {activeColumn && (
                    <ColumnContainer
                      column={activeColumn}
                      deleteColumn={deleteColumnCheck}
                      updateColumn={updateColumn}
                      setPopUpVisible={(value: boolean) =>
                        value ? openPopUp() : closePopUp()
                      }
                      todos={todos.filter(
                        (t) => t.columnId === activeColumn.uniqueId,
                      )}
                      boardId={currentBoard}
                    />
                  )}
                  {activeTodo && (
                    <Todo todo={activeTodo} boardId={currentBoard} />
                  )}
                </DragOverlay>,
                document.body,
              )}
          </DndContext>
        )}
        {popUpVisible && popupType === "createTodo" && (
          <Popup isOpen={popUpVisible} onClose={() => closePopUp()}>
            <TodoForm
              activeColumnId={activeColumnId}
              onClose={() => closePopUp()}
              boardId={currentBoard}
            />
          </Popup>
        )}
        {popUpVisible && popupType === "deleteColumn" && (
          <Popup isOpen={popUpVisible} onClose={() => closePopUp()}>
            <TodoColumnDeleteConfirmation
              closePopUp={closePopUp}
              deleteColumn={deleteColumn}
            />
          </Popup>
        )}
      </div>
    </>
  );
};

const ViewList = () => {
  return <FeatureComingSoon title="List View" />;
};

const ViewTimeline = () => {
  return <FeatureComingSoon title="Timeline View" />;
};

const ViewDueTasks = () => {
  return <FeatureComingSoon title="Due Tasks" />;
};

const KanbanBoard = () => {
  const [addTodoColumn] = useTodoColumn((state: ColumnStore) => [
    state.addTodoColumn,
  ]);

  const [activePage, setActivePage] = useState<string>("board");
  const [currentBoard, setCurrentBoard] = useState<string>("");

  async function createNewColumn() {
    if (!currentBoard) {
      toast.error("Please select a board first");
      return;
    }

    try {
      const data: ColumnTypes = {
        uniqueId: generateUniqueId({ obj: "Col" }),
        color: getRandomColor(),
        title: "New Column",
        todoIds: [],
      };

      addTodoColumn(data);
      await axios.post(`/api/kanban/boards/${currentBoard}/columns`, data);
      toast.success("Column created successfully");
    } catch (error) {
      console.error("Error creating new column:", error);
      toast.error("Error creating new column");
    }
  }

  return (
    <Tabs
      defaultValue="board"
      onValueChange={(value) => {
        setActivePage(value);
      }}
      className="p-10"
    >
      <div className="box-border flex h-full w-full justify-between">
        <TabsList className="px-2 py-6">
          <TabsTrigger value="board" className="text-md">
            Board
          </TabsTrigger>
          <TabsTrigger value="list" className="text-md">
            List
          </TabsTrigger>
          <TabsTrigger value="timeline" className="text-md">
            Timeline
          </TabsTrigger>
          <TabsTrigger value="dueTasks" className="text-md">
            Due Tasks
          </TabsTrigger>
        </TabsList>
        {activePage === "board" && (
          <Button onClick={createNewColumn}>
            <GoPlusCircle className="mr-2 h-4 w-4" /> Add Column
          </Button>
        )}
      </div>
      <TabsContent value="board">
        <ViewKanbanBoard />
      </TabsContent>
      <TabsContent value="list" className="mt-10">
        <ViewList />
      </TabsContent>
      <TabsContent value="timeline" className="mt-10">
        <ViewTimeline />
      </TabsContent>
      <TabsContent value="dueTasks" className="mt-10">
        <ViewDueTasks />
      </TabsContent>
    </Tabs>
  );
};
