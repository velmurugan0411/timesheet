import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITimesheetStatus } from '../timesheet-status.model';
import { TimesheetStatusService } from '../service/timesheet-status.service';

@Injectable({ providedIn: 'root' })
export class TimesheetStatusRoutingResolveService implements Resolve<ITimesheetStatus | null> {
  constructor(protected service: TimesheetStatusService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITimesheetStatus | null | never> {
    const id = route.params['timesheetStatusId'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((timesheetStatus: HttpResponse<ITimesheetStatus>) => {
          if (timesheetStatus.body) {
            return of(timesheetStatus.body);
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
