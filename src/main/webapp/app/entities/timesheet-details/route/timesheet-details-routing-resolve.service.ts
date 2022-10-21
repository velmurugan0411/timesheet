import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITimesheetDetails } from '../timesheet-details.model';
import { TimesheetDetailsService } from '../service/timesheet-details.service';

@Injectable({ providedIn: 'root' })
export class TimesheetDetailsRoutingResolveService implements Resolve<ITimesheetDetails | null> {
  constructor(protected service: TimesheetDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITimesheetDetails | null | never> {
    const id = route.params['timesheetDetailsId'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((timesheetDetails: HttpResponse<ITimesheetDetails>) => {
          if (timesheetDetails.body) {
            return of(timesheetDetails.body);
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
