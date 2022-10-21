import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITimesheet } from '../timesheet.model';
import { TimesheetService } from '../service/timesheet.service';

@Injectable({ providedIn: 'root' })
export class TimesheetRoutingResolveService implements Resolve<ITimesheet | null> {
  constructor(protected service: TimesheetService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITimesheet | null | never> {
    const id = route.params['timesheetId'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((timesheet: HttpResponse<ITimesheet>) => {
          if (timesheet.body) {
            return of(timesheet.body);
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
