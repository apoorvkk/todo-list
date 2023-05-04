import React, { useState, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addTask,
  updateTasks,
  markTaskAsDone,
  setSearchQuery,
  Task,
} from "./store/taskSlice";

import { v4 as uuidv4 } from "uuid";

interface RootState {
  tasks: {
    tasks: Task[];
    searchQuery: string;
  };
}

const TaskManager = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const searchQuery = useSelector(
    (state: RootState) => state.tasks.searchQuery
  );
  const dispatch = useDispatch();

  const [taskInput, setTaskInput] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [parentTaskId, setParentTaskId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (taskInput.trim()) {
      const newTask: Task = {
        id: uuidv4(),
        text: taskInput,
        done: false,
        subtasks: [],
      };

      if (parentTaskId) {
        const addSubtask = (tasks: Task[], parentId: string): Task[] => {
          return tasks.map((task) => {
            if (task.id === parentId) {
              return {
                ...task,
                subtasks: [...task.subtasks, newTask],
              };
            } else if (task.subtasks) {
              return {
                ...task,
                subtasks: addSubtask(task.subtasks, parentId),
              };
            } else {
              return task;
            }
          });
        };

        const updatedTasks = addSubtask(tasks, parentTaskId);
        dispatch(updateTasks(updatedTasks));
      } else {
        dispatch(addTask(newTask));
      }

      setTaskInput("");
      setParentTaskId("");
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    dispatch(setSearchQuery(e.target.value));
  };

  const renderTasks = (
    tasks: Task[],
    searchQuery: string,
    indent: number = 0,
    showChildren: boolean = false
  ) => {
    const taskList: JSX.Element[] = [];

    tasks.forEach((task) => {
      const taskMatched = task.text
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const shouldShowChildren = showChildren || taskMatched;

      if (taskMatched || showChildren) {
        taskList.push(
          <li
            className={`task no-bullets${
              task.id === parentTaskId ? " selected" : ""
            }`}
            key={task.id}
            style={{ marginLeft: `${indent * 50}px` }}
          >
            <div className="task-container">
              <span>{task.text}</span>
              <div className="options-container">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    dispatch(markTaskAsDone(task.id));
                  }}
                >
                  Mark as Done
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setParentTaskId(task.id);
                  }}
                >
                  Select this task to add more
                </button>
              </div>
            </div>
          </li>
        );
      }

      if (task.subtasks) {
        const childTasks = renderTasks(
          task.subtasks,
          searchQuery,
          indent + 1,
          shouldShowChildren
        );
        taskList.push(...childTasks);
      }
    });

    return taskList;
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Add a task"
          className="form-control"
        />
        <button className="btn btn-primary" type="submit">
          Add Task
        </button>
      </form>
      <input
        type="text"
        value={searchInput}
        onChange={handleSearch}
        placeholder="Search tasks"
        className="form-control search"
      />
      <ul className="tasks">{renderTasks(tasks, searchQuery)}</ul>
    </div>
  );
};

export default TaskManager;
