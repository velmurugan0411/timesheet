import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITimesheetDetails, NewTimesheetDetails } from '../timesheet-details.model';

export type PartialUpdateTimesheetDetails = Partial<ITimesheetDetails> & Pick<ITimesheetDetails, 'timesheetDetailsId'>;

type RestOf<T extends ITimesheetDetails | NewTimesheetDetails> = Omit<T, 'workdate'> & {
  workdate?: string | null;
};

export type RestTimesheetDetails = RestOf<ITimesheetDetails>;

export type NewRestTimesheetDetails = RestOf<NewTimesheetDetails>;

export type PartialUpdateRestTimesheetDetails = RestOf<PartialUpdateTimesheetDetails>;

export type EntityResponseType = HttpResponse<ITimesheetDetails>;
export type EntityArrayResponseType = HttpResponse<ITimesheetDetails[]>;

@Injectable({ providedIn: 'root' })
export class TimesheetDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/timesheet-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(timesheetDetails: NewTimesheetDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(timesheetDetails);
    return this.http
      .post<RestTimesheetDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(timesheetDetails: ITimesheetDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(timesheetDetails);
    return this.http
      .put<RestTimesheetDetails>(`${this.resourceUrl}/${this.getTimesheetDetailsIdentifier(timesheetDetails)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(timesheetDetails: PartialUpdateTimesheetDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(timesheetDetails);
    return this.http
      .patch<RestTimesheetDetails>(`${this.resourceUrl}/${this.getTimesheetDetailsIdentifier(timesheetDetails)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTimesheetDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTimesheetDetails[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTimesheetDetailsIdentifier(timesheetDetails: Pick<ITimesheetDetails, 'timesheetDetailsId'>): number {
    return timesheetDetails.timesheetDetailsId;
  }

  compareTimesheetDetails(
    o1: Pick<ITimesheetDetails, 'timesheetDetailsId'> | null,
    o2: Pick<ITimesheetDetails, 'timesheetDetailsId'> | null
  ): boolean {
    return o1 && o2 ? this.getTimesheetDetailsIdentifier(o1) === this.getTimesheetDetailsIdentifier(o2) : o1 === o2;
  }

  addTimesheetDetailsToCollectionIfMissing<Type extends Pick<ITimesheetDetails, 'timesheetDetailsId'>>(
    timesheetDetailsCollection: Type[],
    ...timesheetDetailsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const timesheetDetails: Type[] = timesheetDetailsToCheck.filter(isPresent);
    if (timesheetDetails.length > 0) {
      const timesheetDetailsCollectionIdentifiers = timesheetDetailsCollection.map(
        timesheetDetailsItem => this.getTimesheetDetailsIdentifier(timesheetDetailsItem)!
      );
      const timesheetDetailsToAdd = timesheetDetails.filter(timesheetDetailsItem => {
        const timesheetDetailsIdentifier = this.getTimesheetDetailsIdentifier(timesheetDetailsItem);
        if (timesheetDetailsCollectionIdentifiers.includes(timesheetDetailsIdentifier)) {
          return false;
        }
        timesheetDetailsCollectionIdentifiers.push(timesheetDetailsIdentifier);
        return true;
      });
      return [...timesheetDetailsToAdd, ...timesheetDetailsCollection];
    }
    return timesheetDetailsCollection;
  }

  protected convertDateFromClient<T extends ITimesheetDetails | NewTimesheetDetails | PartialUpdateTimesheetDetails>(
    timesheetDetails: T
  ): RestOf<T> {
    return {
      ...timesheetDetails,
      workdate: timesheetDetails.workdate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTimesheetDetails: RestTimesheetDetails): ITimesheetDetails {
    return {
      ...restTimesheetDetails,
      workdate: restTimesheetDetails.workdate ? dayjs(restTimesheetDetails.workdate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTimesheetDetails>): HttpResponse<ITimesheetDetails> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTimesheetDetails[]>): HttpResponse<ITimesheetDetails[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
