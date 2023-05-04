import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: string;
  text: string;
  done: boolean;
  subtasks: Task[];
}

interface TaskState {
  tasks: Task[];
  searchQuery: string;
}

const initialState: TaskState = {
  tasks: [],
  searchQuery: "",
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    markTaskAsDone: (state, action: PayloadAction<string>) => {
      const removeChildTasks = (tasks: Task[], taskId: string): Task[] => {
        return tasks
          .filter((task) => task.id !== taskId)
          .map((task) => {
            if (task.subtasks) {
              task.subtasks = removeChildTasks(task.subtasks, taskId);
            }
            return task;
          });
      };

      state.tasks = removeChildTasks(state.tasks, action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { addTask, updateTasks, setSearchQuery, markTaskAsDone } =
  taskSlice.actions;
export default taskSlice.reducer;
