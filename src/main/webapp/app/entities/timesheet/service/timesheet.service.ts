import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITimesheet, NewTimesheet } from '../timesheet.model';

export type PartialUpdateTimesheet = Partial<ITimesheet> & Pick<ITimesheet, 'timesheetId'>;

type RestOf<T extends ITimesheet | NewTimesheet> = Omit<T, 'periodStartingDate' | 'periodEndingDate'> & {
  periodStartingDate?: string | null;
  periodEndingDate?: string | null;
};

export type RestTimesheet = RestOf<ITimesheet>;

export type NewRestTimesheet = RestOf<NewTimesheet>;

export type PartialUpdateRestTimesheet = RestOf<PartialUpdateTimesheet>;

export type EntityResponseType = HttpResponse<ITimesheet>;
export type EntityArrayResponseType = HttpResponse<ITimesheet[]>;

@Injectable({ providedIn: 'root' })
export class TimesheetService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/timesheets');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(timesheet: NewTimesheet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(timesheet);
    return this.http
      .post<RestTimesheet>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(timesheet: ITimesheet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(timesheet);
    return this.http
      .put<RestTimesheet>(`${this.resourceUrl}/${this.getTimesheetIdentifier(timesheet)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(timesheet: PartialUpdateTimesheet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(timesheet);
    return this.http
      .patch<RestTimesheet>(`${this.resourceUrl}/${this.getTimesheetIdentifier(timesheet)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTimesheet>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTimesheet[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTimesheetIdentifier(timesheet: Pick<ITimesheet, 'timesheetId'>): number {
    return timesheet.timesheetId;
  }

  compareTimesheet(o1: Pick<ITimesheet, 'timesheetId'> | null, o2: Pick<ITimesheet, 'timesheetId'> | null): boolean {
    return o1 && o2 ? this.getTimesheetIdentifier(o1) === this.getTimesheetIdentifier(o2) : o1 === o2;
  }

  addTimesheetToCollectionIfMissing<Type extends Pick<ITimesheet, 'timesheetId'>>(
    timesheetCollection: Type[],
    ...timesheetsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const timesheets: Type[] = timesheetsToCheck.filter(isPresent);
    if (timesheets.length > 0) {
      const timesheetCollectionIdentifiers = timesheetCollection.map(timesheetItem => this.getTimesheetIdentifier(timesheetItem)!);
      const timesheetsToAdd = timesheets.filter(timesheetItem => {
        const timesheetIdentifier = this.getTimesheetIdentifier(timesheetItem);
        if (timesheetCollectionIdentifiers.includes(timesheetIdentifier)) {
          return false;
        }
        timesheetCollectionIdentifiers.push(timesheetIdentifier);
        return true;
      });
      return [...timesheetsToAdd, ...timesheetCollection];
    }
    return timesheetCollection;
  }

  protected convertDateFromClient<T extends ITimesheet | NewTimesheet | PartialUpdateTimesheet>(timesheet: T): RestOf<T> {
    return {
      ...timesheet,
      periodStartingDate: timesheet.periodStartingDate?.toJSON() ?? null,
      periodEndingDate: timesheet.periodEndingDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTimesheet: RestTimesheet): ITimesheet {
    return {
      ...restTimesheet,
      periodStartingDate: restTimesheet.periodStartingDate ? dayjs(restTimesheet.periodStartingDate) : undefined,
      periodEndingDate: restTimesheet.periodEndingDate ? dayjs(restTimesheet.periodEndingDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTimesheet>): HttpResponse<ITimesheet> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTimesheet[]>): HttpResponse<ITimesheet[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
