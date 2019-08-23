export type Task = {
    _id: string;
    name: string;
    done: boolean
}
export type Query = {
    tasks: Task[];
}