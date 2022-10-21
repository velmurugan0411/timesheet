export interface IUserTask {
  userTaskId: number;
  userId?: number | null;
  taskId?: number | null;
}

export type NewUserTask = Omit<IUserTask, 'userTaskId'> & { userTaskId: null };
