import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITimesheet } from '../timesheet.model';

@Component({
  selector: 'jhi-timesheet-detail',
  templateUrl: './timesheet-detail.component.html',
})
export class TimesheetDetailComponent implements OnInit {
  timesheet: ITimesheet | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ timesheet }) => {
      this.timesheet = timesheet;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
