import axiosInstance from "@/axios/axios-instance";
import type Todo from "@/types/Todo";

export interface GetTodosResponse {
  todos: Todo[];
  nextCursor: string | null;
  hasMore: boolean;
}

export const getTodosApi = async (
  search: string = "",
  cursor: string | null = null,
): Promise<GetTodosResponse> => {
  const response = await axiosInstance.get("/todos", {
    params: { search, cursor, limit: 10 },
  });
  return response.data;
};

export const addTodoApi = async (
  title: string,
  priority: string,
) => {
  const response = await axiosInstance.post("/todos", {
    title,
    priority,
  });

  return response.data.todo;
};

export const updateTodoApi = async (
  id: string,
  updatedFields: Partial<Todo>,
) => {
  await axiosInstance.put(`/todos/${id}`, updatedFields);
};

export const deleteTodoApi = async (id: string) => {
  await axiosInstance.delete(`/todos/${id}`);
};