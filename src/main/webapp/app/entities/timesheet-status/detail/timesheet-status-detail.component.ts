import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITimesheetStatus } from '../timesheet-status.model';

@Component({
  selector: 'jhi-timesheet-status-detail',
  templateUrl: './timesheet-status-detail.component.html',
})
export class TimesheetStatusDetailComponent implements OnInit {
  timesheetStatus: ITimesheetStatus | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ timesheetStatus }) => {
      this.timesheetStatus = timesheetStatus;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
