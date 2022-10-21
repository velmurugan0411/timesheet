import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserTaskFormService, UserTaskFormGroup } from './user-task-form.service';
import { IUserTask } from '../user-task.model';
import { UserTaskService } from '../service/user-task.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';

@Component({
  selector: 'jhi-user-task-update',
  templateUrl: './user-task-update.component.html',
})
export class UserTaskUpdateComponent implements OnInit {
  isSaving = false;
  userTask: IUserTask | null = null;

  usersSharedCollection: IUser[] = [];
  tasksSharedCollection: ITask[] = [];

  editForm: UserTaskFormGroup = this.userTaskFormService.createUserTaskFormGroup();

  constructor(
    protected userTaskService: UserTaskService,
    protected userTaskFormService: UserTaskFormService,
    protected userService: UserService,
    protected taskService: TaskService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareTask = (o1: ITask | null, o2: ITask | null): boolean => this.taskService.compareTask(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userTask }) => {
      this.userTask = userTask;
      if (userTask) {
        this.updateForm(userTask);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userTask = this.userTaskFormService.getUserTask(this.editForm);
    if (userTask.userTaskId !== null) {
      this.subscribeToSaveResponse(this.userTaskService.update(userTask));
    } else {
      this.subscribeToSaveResponse(this.userTaskService.create(userTask));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserTask>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(userTask: IUserTask): void {
    this.userTask = userTask;
    this.userTaskFormService.resetForm(this.editForm, userTask);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, userTask.userId);
    this.tasksSharedCollection = this.taskService.addTaskToCollectionIfMissing<ITask>(this.tasksSharedCollection, userTask.taskId);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.userTask?.userId)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.taskService
      .query()
      .pipe(map((res: HttpResponse<ITask[]>) => res.body ?? []))
      .pipe(map((tasks: ITask[]) => this.taskService.addTaskToCollectionIfMissing<ITask>(tasks, this.userTask?.taskId)))
      .subscribe((tasks: ITask[]) => (this.tasksSharedCollection = tasks));
  }
}
