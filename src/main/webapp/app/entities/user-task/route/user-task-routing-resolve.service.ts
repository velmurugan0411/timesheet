import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserTask } from '../user-task.model';
import { UserTaskService } from '../service/user-task.service';

@Injectable({ providedIn: 'root' })
export class UserTaskRoutingResolveService implements Resolve<IUserTask | null> {
  constructor(protected service: UserTaskService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserTask | null | never> {
    const id = route.params['userTaskId'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userTask: HttpResponse<IUserTask>) => {
          if (userTask.body) {
            return of(userTask.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
