import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TimesheetFormService, TimesheetFormGroup } from './timesheet-form.service';
import { ITimesheet } from '../timesheet.model';
import { TimesheetService } from '../service/timesheet.service';
import { ITimesheetStatus } from 'app/entities/timesheet-status/timesheet-status.model';
import { TimesheetStatusService } from 'app/entities/timesheet-status/service/timesheet-status.service';

@Component({
  selector: 'jhi-timesheet-update',
  templateUrl: './timesheet-update.component.html',
})
export class TimesheetUpdateComponent implements OnInit {
  isSaving = false;
  timesheet: ITimesheet | null = null;

  timesheetStatusesSharedCollection: ITimesheetStatus[] = [];

  editForm: TimesheetFormGroup = this.timesheetFormService.createTimesheetFormGroup();

  constructor(
    protected timesheetService: TimesheetService,
    protected timesheetFormService: TimesheetFormService,
    protected timesheetStatusService: TimesheetStatusService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTimesheetStatus = (o1: ITimesheetStatus | null, o2: ITimesheetStatus | null): boolean =>
    this.timesheetStatusService.compareTimesheetStatus(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ timesheet }) => {
      this.timesheet = timesheet;
      if (timesheet) {
        this.updateForm(timesheet);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const timesheet = this.timesheetFormService.getTimesheet(this.editForm);
    if (timesheet.timesheetId !== null) {
      this.subscribeToSaveResponse(this.timesheetService.update(timesheet));
    } else {
      this.subscribeToSaveResponse(this.timesheetService.create(timesheet));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITimesheet>>): void {
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

  protected updateForm(timesheet: ITimesheet): void {
    this.timesheet = timesheet;
    this.timesheetFormService.resetForm(this.editForm, timesheet);

    this.timesheetStatusesSharedCollection = this.timesheetStatusService.addTimesheetStatusToCollectionIfMissing<ITimesheetStatus>(
      this.timesheetStatusesSharedCollection,
      timesheet.timesheetStatusId
    );
  }

  protected loadRelationshipsOptions(): void {
    this.timesheetStatusService
      .query()
      .pipe(map((res: HttpResponse<ITimesheetStatus[]>) => res.body ?? []))
      .pipe(
        map((timesheetStatuses: ITimesheetStatus[]) =>
          this.timesheetStatusService.addTimesheetStatusToCollectionIfMissing<ITimesheetStatus>(
            timesheetStatuses,
            this.timesheet?.timesheetStatusId
          )
        )
      )
      .subscribe((timesheetStatuses: ITimesheetStatus[]) => (this.timesheetStatusesSharedCollection = timesheetStatuses));
  }
}
