import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITimeoffType } from '../timeoff-type.model';
import { TimeoffTypeService } from '../service/timeoff-type.service';

@Injectable({ providedIn: 'root' })
export class TimeoffTypeRoutingResolveService implements Resolve<ITimeoffType | null> {
  constructor(protected service: TimeoffTypeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITimeoffType | null | never> {
    const id = route.params['timeoffTypeId'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((timeoffType: HttpResponse<ITimeoffType>) => {
          if (timeoffType.body) {
            return of(timeoffType.body);
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
