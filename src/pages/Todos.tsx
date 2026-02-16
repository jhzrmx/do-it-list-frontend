/* eslint-disable react-hooks/exhaustive-deps */
import axiosInstance from "@/axios/axios-instance";
import InputField from "@/components/InputField";
import { default as AddModal, default as EditModal } from "@/components/Modal";
import PrimaryButton from "@/components/PrimaryButton";
import Sidebar from "@/components/Sidebar";
import TodoContainer from "@/components/TodoContainer";
import { useAuthStore } from "@/stores/auth.store";
import type Todo from "@/types/Todo";
import type { Priority } from "@/types/Todo";
import { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdAdd, MdMenu, MdOutlineSearch } from "react-icons/md";
import { SlSocialDropbox } from "react-icons/sl";
import Logo from "../assets/logo.svg";

const Todos = () => {
  const { user } = useAuthStore();
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearchText, setDebouncedSearchText] =
    useState<string>(searchText);
  const debounceTimeout = useRef<number | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);

  // Todo Properties
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("low");

  const lastTodoRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingMore) return;
      if (!hasMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!nextCursor) return;
          setIsFetchingMore(true);
          getTodos(debouncedSearchText, nextCursor).finally(() =>
            setIsFetchingMore(false),
          );
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetchingMore, hasMore, nextCursor, debouncedSearchText],
  );

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
    setTodos([]);
    setNextCursor(null);
    setHasMore(true);
    getTodos(debouncedSearchText, null, true);
  }, [debouncedSearchText]);

  const nextCursorRef = useRef<string | null>(null);

  useEffect(() => {
    nextCursorRef.current = nextCursor;
  }, [nextCursor]);

  const getTodos = async (
    search: string = "",
    cursor: string | null = null,
    isInitialLoad = false,
  ) => {
    if (!hasMore && !isInitialLoad) return; // stop fetching if no more
    if (cursor) {
      setIsFetchingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await axiosInstance.get("/todos", {
        params: { search, cursor, limit: 10 },
      });
      const {
        todos: newTodos,
        nextCursor: newNextCursor,
        hasMore: more,
      } = response.data;

      setTodos((prev) => (isInitialLoad ? newTodos : [...prev, ...newTodos]));
      setNextCursor(newNextCursor);
      setHasMore(more);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Failed to fetch todos",
      );
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const addTodo = async (title: string, priority: string = "low") => {
    if (!title.trim()) return;
    try {
      const response = await axiosInstance.post("/todos", { title, priority });
      const newTodo = response.data;
      setTodos((prev) => [newTodo, ...prev]);
      toast.success("Todo added successfully");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Failed to add todo");
      console.error(err);
    }
  };

  const updateTodo = async (id: string, updatedFields: Partial<Todo>) => {
    try {
      await axiosInstance.put(`/todos/${id}`, updatedFields);
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, ...updatedFields } : todo,
        ),
      );
      toast.success("Todo updated successfully");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Failed to update todo",
      );
      console.error(err);
    }
  };

  const todoDone = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
    updateTodo(id, { completed: !todos.find((t) => t._id === id)?.completed });
  };

  const deleteTodo = async (id: string) => {
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
    }
  };

  const todoClickDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this todo?")) {
      deleteTodo(id);
    }
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <AddModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold my-4">Add To Do</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addTodo(title, priority);
              setAddModalOpen(false);
            }}
          >
            <input
              placeholder="Title here"
              className="w-full px-4 py-2 my-2 rounded-lg bg-white"
              value={title}
              onChange={(e) => setTitle(e.target.value as string)}
              required
            />

            <select
              className="w-full px-4 py-2 my-2 rounded-lg bg-white cursor-pointer"
              onChange={(e) => setPriority(e.target.value as Priority)}
              required
            >
              <option value="" hidden>
                Priority
              </option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <PrimaryButton content="Add" type="submit" />
          </form>

          <button
            onClick={() => setAddModalOpen(false)}
            className="text-sm cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </AddModal>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
      >
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold my-4">Edit To Do</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateTodo(id, { title, priority });
              setEditModalOpen(false);
            }}
          >
            <input
              placeholder="Title here"
              className="w-full px-4 py-2 my-2 rounded-lg bg-white"
              value={title}
              onChange={(e) => setTitle(e.target.value as string)}
              required
            />

            <select
              defaultValue={priority}
              className="w-full px-4 py-2 my-2 rounded-lg bg-white cursor-pointer"
              onChange={(e) => setPriority(e.target.value as Priority)}
              required
            >
              <option value="" hidden>
                Priority
              </option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <PrimaryButton content="Update" type="submit" />
          </form>

          <button
            onClick={() => setEditModalOpen(false)}
            className="text-sm cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </EditModal>

      <div className="h-dvh bg-primary flex flex-col">
        <div className="px-4 h-32 flex items-center">
          <button
            className="text-white cursor-pointer"
            onClick={() => setSidebarOpen(true)}
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
              setSearchText(e.target.value as string);
            }}
          />
        </div>
        <div className="bg-secondary rounded-t-4xl flex flex-1 flex-col min-h-0">
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

          <div className="w-full flex-1 overflow-y-auto scrollbar-hide px-1 pb-6">
            {isLoading ? (
              <div className="text-primary flex flex-col items-center text-lg py-8">
                <div className="mb-4">
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
                  {debouncedSearchText === ""
                    ? "Start adding todos by clicking the add icon!"
                    : "0 results found"}
                </p>
              </div>
            ) : (
              todos.map((todo, index) => {
                if (index === todos.length - 1) {
                  return (
                    <div ref={lastTodoRef} key={todo._id}>
                      <TodoContainer
                        todo={todo}
                        onToggle={(id) => todoDone(id)}
                        onEdit={(id) => {
                          setEditModalOpen(true);
                          setId(id);
                          setTitle(todo.title);
                          setPriority(todo.priority);
                        }}
                        onDelete={(id) => todoClickDelete(id)}
                      />
                    </div>
                  );
                }

                return (
                  <TodoContainer
                    key={todo._id}
                    todo={todo}
                    onToggle={(id) => todoDone(id)}
                    onEdit={(id) => {
                      setEditModalOpen(true);
                      setId(id);
                      setTitle(todo.title);
                      setPriority(todo.priority);
                    }}
                    onDelete={(id) => todoClickDelete(id)}
                  />
                );
              })
            )}
            {isFetchingMore && (
              <div className="text-center py-4 text-sm text-gray-500">
                Loading more...
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-semi-primary text-white flex items-center justify-center shadow-lg hover:bg-primary transition hover:cursor-pointer"
        onClick={async () => {
          setTitle("");
          setAddModalOpen(true);
        }}
      >
        <MdAdd size={24} />
      </button>
    </>
  );
};

export default Todos;
