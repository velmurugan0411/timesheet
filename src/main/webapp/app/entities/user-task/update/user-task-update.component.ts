import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { UserTaskFormService, UserTaskFormGroup } from './user-task-form.service';
import { IUserTask } from '../user-task.model';
import { UserTaskService } from '../service/user-task.service';

@Component({
  selector: 'jhi-user-task-update',
  templateUrl: './user-task-update.component.html',
})
export class UserTaskUpdateComponent implements OnInit {
  isSaving = false;
  userTask: IUserTask | null = null;

  editForm: UserTaskFormGroup = this.userTaskFormService.createUserTaskFormGroup();

  constructor(
    protected userTaskService: UserTaskService,
    protected userTaskFormService: UserTaskFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userTask }) => {
      this.userTask = userTask;
      if (userTask) {
        this.updateForm(userTask);
      }
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
  }
}
