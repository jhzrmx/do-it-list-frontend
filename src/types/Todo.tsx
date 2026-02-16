export type Priority = "low" | "medium" | "high";

export default interface Todo {
  _id: string;
  title: string;
  priority: Priority;
  completed: boolean;
}
