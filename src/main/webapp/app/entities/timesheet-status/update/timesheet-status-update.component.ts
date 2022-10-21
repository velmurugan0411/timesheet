import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TimesheetStatusFormService, TimesheetStatusFormGroup } from './timesheet-status-form.service';
import { ITimesheetStatus } from '../timesheet-status.model';
import { TimesheetStatusService } from '../service/timesheet-status.service';

@Component({
  selector: 'jhi-timesheet-status-update',
  templateUrl: './timesheet-status-update.component.html',
})
export class TimesheetStatusUpdateComponent implements OnInit {
  isSaving = false;
  timesheetStatus: ITimesheetStatus | null = null;

  editForm: TimesheetStatusFormGroup = this.timesheetStatusFormService.createTimesheetStatusFormGroup();

  constructor(
    protected timesheetStatusService: TimesheetStatusService,
    protected timesheetStatusFormService: TimesheetStatusFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ timesheetStatus }) => {
      this.timesheetStatus = timesheetStatus;
      if (timesheetStatus) {
        this.updateForm(timesheetStatus);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const timesheetStatus = this.timesheetStatusFormService.getTimesheetStatus(this.editForm);
    if (timesheetStatus.timesheetStatusId !== null) {
      this.subscribeToSaveResponse(this.timesheetStatusService.update(timesheetStatus));
    } else {
      this.subscribeToSaveResponse(this.timesheetStatusService.create(timesheetStatus));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITimesheetStatus>>): void {
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

  protected updateForm(timesheetStatus: ITimesheetStatus): void {
    this.timesheetStatus = timesheetStatus;
    this.timesheetStatusFormService.resetForm(this.editForm, timesheetStatus);
  }
}
