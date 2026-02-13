import axiosInstance from "@/axios/axios-instance";
import InputField from "@/components/InputField";
import Sidebar from "@/components/Sidebar";
import TodoContainer from "@/components/TodoContainer";
import { useAuthStore } from "@/stores/auth.store";
import type Todo from "@/types/Todo";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdAdd, MdMenu, MdOutlineSearch } from "react-icons/md";
import { SlSocialDropbox } from "react-icons/sl";
import Logo from "../assets/logo.svg";

const Todos = () => {
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  const debounceTimeout = useRef<number | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchText]);

  useEffect(() => {
    getTodos(debouncedSearchText);
  }, [debouncedSearchText]);

  const getTodos = async (search: string = "") => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/todos", {
        params: { search },
      });

      setTodos(response.data.todos);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Failed to fetch todos",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title: string, priority: string = "low") => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await axiosInstance.post("/todos", { title, priority });
      getTodos();
      toast.success("Todo added successfully");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Failed to add todo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id: string, updatedFields: Partial<Todo>) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/todos/${id}`, updatedFields);
      getTodos();
      toast.success("Todo updated successfully");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Failed to update todo",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const todoDone = (id: string) => {
    const todo = todos.find((t) => t._id === id);
    if (todo) {
      updateTodo(id, { completed: !todo.completed });
    }
  };

  const todoClickEdit = (id: string) => {
    const newTask = prompt("Edit Todo", todos.find((t) => t._id === id)?.title);
    if (newTask !== null) {
      updateTodo(id, { title: newTask });
    }
  };

  const deleteTodo = async (id: string) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/todos/${id}`);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
      toast.success("Todo deleted successfully");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Failed to delete todo",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const todoClickDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this todo?")) {
      deleteTodo(id);
    }
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="h-dvh bg-primary flex flex-col">
        <div className="px-4 h-32 flex items-center">
          <button
            className="text-white cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MdMenu size={24} />
          </button>

          <div className="px-4 text-white">
            <h1 className="text-3xl">Hello!</h1>
            <h1 className="text-3xl font-bold">{user?.fullName}!</h1>
          </div>

          <div className="ml-auto">
            <img src={Logo} className="w-24" />
          </div>
        </div>
        <div className="px-4 pb-6">
          <InputField
            type="search"
            icon={<MdOutlineSearch size={24} />}
            placeholder="Search Todos"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </div>
        <div className="bg-secondary rounded-t-4xl flex flex-1 flex-col items-center">
          <div className="w-full flex items-center justify-center">
            <svg
              className="w-12"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 290.658 290.658"
            >
              <g>
                <g>
                  <rect y="139.474" width="290.658" height="11.711" />
                </g>
              </g>
            </svg>
          </div>
          {isLoading ? (
            <div className="text-primary flex flex-col items-center text-lg py-8">
              <div className="animate-spin mb-4">
                <SlSocialDropbox size={96} />
              </div>
              <h1 className="font-bold text-3xl my-2">Loading Todos...</h1>
              <p className="text-black text-center text-xs">
                Please wait while we fetch your todos.
              </p>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-primary flex flex-col items-center text-lg py-8">
              <SlSocialDropbox size={96} />
              <h1 className="font-bold text-3xl my-2">No Todos Found!</h1>
              <p className="text-black text-center text-xs">
                Start adding todos by clicking the add icon!
              </p>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoContainer
                key={todo._id}
                todo={todo}
                onToggle={(id) => todoDone(id)}
                onEdit={(id) => todoClickEdit(id)}
                onDelete={(id) => todoClickDelete(id)}
              />
            ))
          )}
        </div>
      </div>

      <button
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-semi-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition hover:cursor-pointer"
        onClick={async () => {
          const task = prompt("Enter new todo");
          if (task) await addTodo(task);
        }}
      >
        <MdAdd size={24} />
      </button>
    </>
  );
};

export default Todos;
