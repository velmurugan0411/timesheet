import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserTask } from '../user-task.model';

@Component({
  selector: 'jhi-user-task-detail',
  templateUrl: './user-task-detail.component.html',
})
export class UserTaskDetailComponent implements OnInit {
  userTask: IUserTask | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userTask }) => {
      this.userTask = userTask;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
