/* eslint-disable react-hooks/exhaustive-deps */
import axiosInstance from "@/axios/axios-instance";
import InputField from "@/components/InputField";
import {
  default as AddModal,
  default as DeleteModal,
  default as EditModal,
} from "@/components/Modal";
import PrimaryButton from "@/components/PrimaryButton";
import Sidebar from "@/components/Sidebar";
import TodoContainer from "@/components/TodoContainer";
import TodoContainerSkeleton from "@/components/TodoContainerSkeleton";
import { useAuthStore } from "@/stores/auth.store";
import type Todo from "@/types/Todo";
import type { Priority } from "@/types/Todo";
import { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdAdd, MdMenu, MdOutlineSearch } from "react-icons/md";
import { SlSocialDropbox } from "react-icons/sl";
import Logo from "../assets/logo.svg";

/**
 * Todos component - Main page for displaying and managing user's todo items
 * Features: infinite scroll, search, add/edit/delete todos, responsive design
 */
const Todos = () => {
  // Get authenticated user from auth store
  const { user } = useAuthStore();

  // UI state
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearchText, setDebouncedSearchText] =
    useState<string>(searchText);
  const debounceTimeout = useRef<number | null>(null);

  // Loading and data states
  const [isLoading, setLoading] = useState<boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Infinite scroll refs
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isRequestingRef = useRef(false);

  // Modal states
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  // Todo form states
  const [id, setId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("low");

  /**
   * Callback ref for infinite scroll - observes the last todo item
   * Triggers loading more todos when the last item comes into view
   */
  const lastTodoRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          if (!nextCursorRef.current) return;
          getTodos(debouncedSearchText, nextCursorRef.current);
        },
        {
          rootMargin: "200px",
        },
      );
      observerRef.current.observe(node);
    },
    [debouncedSearchText],
  );

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchText]);

  // Reset todos and fetch new list when search text changes
  useEffect(() => {
    setTodos([]);
    setNextCursor(null);
    setHasMore(true);
    getTodos(debouncedSearchText, null, true);
  }, [debouncedSearchText]);

  // Ref to keep nextCursor in sync for intersection observer
  const nextCursorRef = useRef<string | null>(null);

  useEffect(() => {
    nextCursorRef.current = nextCursor;
  }, [nextCursor]);

  /**
   * Fetches todos from the API with pagination and search support
   * @param search - Search query string
   * @param cursor - Pagination cursor for next page
   * @param isInitialLoad - Whether this is the first load (resets list)
   */
  const getTodos = async (
    search: string = "",
    cursor: string | null = null,
    isInitialLoad = false,
  ) => {
    if (isRequestingRef.current) return;
    if (!hasMore && !isInitialLoad) return;

    isRequestingRef.current = true;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    cursor ? setIsFetchingMore(true) : setLoading(true);

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
      isRequestingRef.current = false;
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  /**
   * Adds a new todo item to the list
   * @param title - Todo title
   * @param priority - Todo priority level
   */
  const addTodo = async (title: string, priority: string = "low") => {
    if (!title.trim()) return;
    try {
      const response = await axiosInstance.post("/todos", { title, priority });
      const newTodo = response.data.todo;
      setTodos((prev) => [newTodo, ...prev]);
      toast.success("Todo added successfully");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Failed to add todo");
      console.error(err);
    }
  };

  /**
   * Updates an existing todo item
   * @param id - Todo ID to update
   * @param updatedFields - Fields to update
   */
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

  /**
   * Toggles the completion status of a todo
   * @param id - Todo ID to toggle
   */
  const todoDone = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
    updateTodo(id, { completed: !todos.find((t) => t._id === id)?.completed });
  };

  /**
   * Deletes a todo item
   * @param id - Todo ID to delete
   */
  const deleteTodo = async (id: string) => {
    try {
      await axiosInstance.delete(`/todos/${id}`);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
      setDeleteModalOpen(false);
      toast.success("Todo deleted successfully");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Failed to delete todo",
      );
      console.error(err);
    }
  };

  /**
   * Opens the delete confirmation modal for a todo
   * @param id - Todo ID to delete
   */
  const todoClickDelete = (id: string) => {
    setId(id);
    setDeleteModalOpen(true);
  };

  return (
    <>
      {/* Add Todo Modal */}
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
              value={title}
              className="w-full px-4 py-2 my-2 rounded-lg bg-white"
              onChange={(e) => setTitle(e.target.value as string)}
              required
            />
            <select
              value={priority}
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

      {/* Edit Todo Modal */}
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
              value={priority}
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

      {/* Delete Todo Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold my-4">Delete this todo?</h2>
          <div className="my-8 text-sm">This action can't be undone</div>
          <PrimaryButton
            content="Delete"
            isNegative={true}
            onClick={() => deleteTodo(id)}
          />
          <PrimaryButton
            content="Cancel"
            onClick={() => setDeleteModalOpen(false)}
          />
        </div>
      </DeleteModal>

      {/* Main Layout */}
      <div className="h-dvh flex bg-primary overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header Section */}
          <div className="px-6 py-6 flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-row gap-4">
                <button
                  className="text-white cursor-pointer lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <MdMenu size={24} aria-label="menu" />
                </button>

                <div className="text-white">
                  <h1 className="text-3xl">Hello!</h1>
                  <h1 className="text-3xl font-bold">{user?.fullName}!</h1>
                </div>
              </div>
              <img src={Logo} alt="dil-logo" className="w-24 lg:hidden" />
            </div>

            {/* Search Input */}
            <div className="w-full lg:w-96 lg:ml-auto">
              <InputField
                type="search"
                icon={<MdOutlineSearch size={24} />}
                placeholder="Search Todos"
                onChange={(e) => setSearchText(e.target.value as string)}
              />
            </div>
          </div>

          {/* Main Content Container */}
          <main className="bg-secondary rounded-t-4xl flex flex-1 flex-col min-h-0">
            {/* Decorative SVG */}
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

            {/* Todo List Container */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {isLoading ? (
                  // Loading skeletons
                  <div className="space-y-3 py-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <TodoContainerSkeleton key={i} />
                    ))}
                  </div>
                ) : todos.length === 0 ? (
                  // Empty state
                  <div className="col-span-full text-primary flex flex-col items-center justify-center text-lg py-12">
                    <SlSocialDropbox size={96} />
                    <h1 className="font-bold text-3xl my-2">No Todos Found!</h1>
                    <p className="text-black text-center text-xs">
                      {debouncedSearchText === ""
                        ? "Start adding todos by clicking the add icon!"
                        : "0 results found"}
                    </p>
                  </div>
                ) : (
                  // Todo items list
                  todos.map((todo, index) => {
                    if (index === todos.length - 1) {
                      return (
                        <div ref={lastTodoRef} key={todo._id}>
                          <TodoContainer
                            otherClassName="animate-fade-up"
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
                        otherClassName="animate-fade-up"
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
                {isFetchingMore && <TodoContainerSkeleton />}
              </div>
            </div>
          </main>
        </div>

        {/* Floating Add Todo Button */}
        <button
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full p-0 border-none bg-transparent cursor-pointer"
          onClick={() => {
            setTitle("");
            setAddModalOpen(true);
          }}
        >
          <div className="absolute inset-0 rounded-full shadow-lg"></div>
          <div className="relative w-full h-full rounded-full bg-semi-primary flex items-center justify-center text-white transition hover:rotate-90 hover:bg-primary">
            <MdAdd size={24} aria-label="add-todo" />
          </div>
        </button>
      </div>
    </>
  );
};

export default Todos;
