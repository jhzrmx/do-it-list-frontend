import type Todo from "@/types/Todo";
import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";

export type Priority = "low" | "medium" | "high";

interface TodoContainerProps {
  todo: Todo;
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  otherClassName?: string
}

const priorityColorMap: Record<Priority, string> = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

const TodoContainer: React.FC<TodoContainerProps> = ({
  todo,
  onToggle,
  onEdit,
  onDelete,
  otherClassName = "",
}) => {
  return (
    <div className="w-full">
      <div className={`w-full bg-gray-100 rounded-xl shadow-sm flex items-center justify-between px-4 py-3 relative overflow-hidden ${otherClassName}`}>
        <div
          className={`absolute left-0 top-0 h-full w-2 ${priorityColorMap[todo.priority]}`}
        />

        <div className="flex items-center gap-3 pl-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle?.(todo._id)}
            className="w-4 h-4 accent-black cursor-pointer"
          />

          <span
            className={`text-sm ${
              todo.completed
                ? "line-through text-gray-400 "
                : "text-gray-800 font-bold"
            }`}
          >
            {todo.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onEdit?.(todo._id)}
            className="text-orange-500 hover:scale-110 transition cursor-pointer"
          >
            <MdEdit size={20} aria-label="edit-todo" />
          </button>

          <button
            onClick={() => onDelete?.(todo._id)}
            className="text-red-500 hover:scale-110 transition cursor-pointer"
          >
            <MdDelete size={20} aria-label="delete-todo" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TodoContainer);
