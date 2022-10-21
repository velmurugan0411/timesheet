import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TimesheetDetailsFormService, TimesheetDetailsFormGroup } from './timesheet-details-form.service';
import { ITimesheetDetails } from '../timesheet-details.model';
import { TimesheetDetailsService } from '../service/timesheet-details.service';
import { ITimeoffType } from 'app/entities/timeoff-type/timeoff-type.model';
import { TimeoffTypeService } from 'app/entities/timeoff-type/service/timeoff-type.service';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';
import { ITimesheet } from 'app/entities/timesheet/timesheet.model';
import { TimesheetService } from 'app/entities/timesheet/service/timesheet.service';

@Component({
  selector: 'jhi-timesheet-details-update',
  templateUrl: './timesheet-details-update.component.html',
})
export class TimesheetDetailsUpdateComponent implements OnInit {
  isSaving = false;
  timesheetDetails: ITimesheetDetails | null = null;

  timeoffTypesSharedCollection: ITimeoffType[] = [];
  tasksSharedCollection: ITask[] = [];
  timesheetsSharedCollection: ITimesheet[] = [];

  editForm: TimesheetDetailsFormGroup = this.timesheetDetailsFormService.createTimesheetDetailsFormGroup();

  constructor(
    protected timesheetDetailsService: TimesheetDetailsService,
    protected timesheetDetailsFormService: TimesheetDetailsFormService,
    protected timeoffTypeService: TimeoffTypeService,
    protected taskService: TaskService,
    protected timesheetService: TimesheetService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTimeoffType = (o1: ITimeoffType | null, o2: ITimeoffType | null): boolean => this.timeoffTypeService.compareTimeoffType(o1, o2);

  compareTask = (o1: ITask | null, o2: ITask | null): boolean => this.taskService.compareTask(o1, o2);

  compareTimesheet = (o1: ITimesheet | null, o2: ITimesheet | null): boolean => this.timesheetService.compareTimesheet(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ timesheetDetails }) => {
      this.timesheetDetails = timesheetDetails;
      if (timesheetDetails) {
        this.updateForm(timesheetDetails);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const timesheetDetails = this.timesheetDetailsFormService.getTimesheetDetails(this.editForm);
    if (timesheetDetails.timesheetDetailsId !== null) {
      this.subscribeToSaveResponse(this.timesheetDetailsService.update(timesheetDetails));
    } else {
      this.subscribeToSaveResponse(this.timesheetDetailsService.create(timesheetDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITimesheetDetails>>): void {
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

  protected updateForm(timesheetDetails: ITimesheetDetails): void {
    this.timesheetDetails = timesheetDetails;
    this.timesheetDetailsFormService.resetForm(this.editForm, timesheetDetails);

    this.timeoffTypesSharedCollection = this.timeoffTypeService.addTimeoffTypeToCollectionIfMissing<ITimeoffType>(
      this.timeoffTypesSharedCollection,
      timesheetDetails.timeoffTypeId
    );
    this.tasksSharedCollection = this.taskService.addTaskToCollectionIfMissing<ITask>(this.tasksSharedCollection, timesheetDetails.taskId);
    this.timesheetsSharedCollection = this.timesheetService.addTimesheetToCollectionIfMissing<ITimesheet>(
      this.timesheetsSharedCollection,
      timesheetDetails.timesheetId
    );
  }

  protected loadRelationshipsOptions(): void {
    this.timeoffTypeService
      .query()
      .pipe(map((res: HttpResponse<ITimeoffType[]>) => res.body ?? []))
      .pipe(
        map((timeoffTypes: ITimeoffType[]) =>
          this.timeoffTypeService.addTimeoffTypeToCollectionIfMissing<ITimeoffType>(timeoffTypes, this.timesheetDetails?.timeoffTypeId)
        )
      )
      .subscribe((timeoffTypes: ITimeoffType[]) => (this.timeoffTypesSharedCollection = timeoffTypes));

    this.taskService
      .query()
      .pipe(map((res: HttpResponse<ITask[]>) => res.body ?? []))
      .pipe(map((tasks: ITask[]) => this.taskService.addTaskToCollectionIfMissing<ITask>(tasks, this.timesheetDetails?.taskId)))
      .subscribe((tasks: ITask[]) => (this.tasksSharedCollection = tasks));

    this.timesheetService
      .query()
      .pipe(map((res: HttpResponse<ITimesheet[]>) => res.body ?? []))
      .pipe(
        map((timesheets: ITimesheet[]) =>
          this.timesheetService.addTimesheetToCollectionIfMissing<ITimesheet>(timesheets, this.timesheetDetails?.timesheetId)
        )
      )
      .subscribe((timesheets: ITimesheet[]) => (this.timesheetsSharedCollection = timesheets));
  }
}
