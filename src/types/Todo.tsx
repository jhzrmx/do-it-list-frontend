export default interface Todo {
  _id: string;
  title: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}
