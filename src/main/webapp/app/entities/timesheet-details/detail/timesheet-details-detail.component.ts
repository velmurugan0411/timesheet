import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITimesheetDetails } from '../timesheet-details.model';

@Component({
  selector: 'jhi-timesheet-details-detail',
  templateUrl: './timesheet-details-detail.component.html',
})
export class TimesheetDetailsDetailComponent implements OnInit {
  timesheetDetails: ITimesheetDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ timesheetDetails }) => {
      this.timesheetDetails = timesheetDetails;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
