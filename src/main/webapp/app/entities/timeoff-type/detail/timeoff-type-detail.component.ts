import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITimeoffType } from '../timeoff-type.model';

@Component({
  selector: 'jhi-timeoff-type-detail',
  templateUrl: './timeoff-type-detail.component.html',
})
export class TimeoffTypeDetailComponent implements OnInit {
  timeoffType: ITimeoffType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ timeoffType }) => {
      this.timeoffType = timeoffType;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
