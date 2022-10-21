import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITask, NewTask } from '../task.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { taskId: unknown }> = Partial<Omit<T, 'taskId'>> & { taskId: T['taskId'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITask for edit and NewTaskFormGroupInput for create.
 */
type TaskFormGroupInput = ITask | PartialWithRequiredKeyOf<NewTask>;

type TaskFormDefaults = Pick<NewTask, 'taskId' | 'activeInd'>;

type TaskFormGroupContent = {
  taskId: FormControl<ITask['taskId'] | NewTask['taskId']>;
  taskName: FormControl<ITask['taskName']>;
  description: FormControl<ITask['description']>;
  activeInd: FormControl<ITask['activeInd']>;
  projectId: FormControl<ITask['projectId']>;
};

export type TaskFormGroup = FormGroup<TaskFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TaskFormService {
  createTaskFormGroup(task: TaskFormGroupInput = { taskId: null }): TaskFormGroup {
    const taskRawValue = {
      ...this.getFormDefaults(),
      ...task,
    };
    return new FormGroup<TaskFormGroupContent>({
      taskId: new FormControl(
        { value: taskRawValue.taskId, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      taskName: new FormControl(taskRawValue.taskName),
      description: new FormControl(taskRawValue.description),
      activeInd: new FormControl(taskRawValue.activeInd),
      projectId: new FormControl(taskRawValue.projectId, {
        validators: [Validators.required],
      }),
    });
  }

  getTask(form: TaskFormGroup): ITask | NewTask {
    return form.getRawValue() as ITask | NewTask;
  }

  resetForm(form: TaskFormGroup, task: TaskFormGroupInput): void {
    const taskRawValue = { ...this.getFormDefaults(), ...task };
    form.reset(
      {
        ...taskRawValue,
        taskId: { value: taskRawValue.taskId, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TaskFormDefaults {
    return {
      taskId: null,
      activeInd: false,
    };
  }
}
