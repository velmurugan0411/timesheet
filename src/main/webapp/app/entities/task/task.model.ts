import { IProject } from 'app/entities/project/project.model';

export interface ITask {
  taskId: number;
  projectId?: number | null;
  taskName?: string | null;
  description?: string | null;
  activeInd?: boolean | null;
  projectId?: Pick<IProject, 'projectId'> | null;
}

export type NewTask = Omit<ITask, 'taskId'> & { taskId: null };
