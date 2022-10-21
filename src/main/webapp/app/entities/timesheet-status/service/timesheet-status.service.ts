import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITimesheetStatus, NewTimesheetStatus } from '../timesheet-status.model';

export type PartialUpdateTimesheetStatus = Partial<ITimesheetStatus> & Pick<ITimesheetStatus, 'timesheetStatusId'>;

export type EntityResponseType = HttpResponse<ITimesheetStatus>;
export type EntityArrayResponseType = HttpResponse<ITimesheetStatus[]>;

@Injectable({ providedIn: 'root' })
export class TimesheetStatusService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/timesheet-statuses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(timesheetStatus: NewTimesheetStatus): Observable<EntityResponseType> {
    return this.http.post<ITimesheetStatus>(this.resourceUrl, timesheetStatus, { observe: 'response' });
  }

  update(timesheetStatus: ITimesheetStatus): Observable<EntityResponseType> {
    return this.http.put<ITimesheetStatus>(`${this.resourceUrl}/${this.getTimesheetStatusIdentifier(timesheetStatus)}`, timesheetStatus, {
      observe: 'response',
    });
  }

  partialUpdate(timesheetStatus: PartialUpdateTimesheetStatus): Observable<EntityResponseType> {
    return this.http.patch<ITimesheetStatus>(`${this.resourceUrl}/${this.getTimesheetStatusIdentifier(timesheetStatus)}`, timesheetStatus, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITimesheetStatus>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITimesheetStatus[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTimesheetStatusIdentifier(timesheetStatus: Pick<ITimesheetStatus, 'timesheetStatusId'>): number {
    return timesheetStatus.timesheetStatusId;
  }

  compareTimesheetStatus(
    o1: Pick<ITimesheetStatus, 'timesheetStatusId'> | null,
    o2: Pick<ITimesheetStatus, 'timesheetStatusId'> | null
  ): boolean {
    return o1 && o2 ? this.getTimesheetStatusIdentifier(o1) === this.getTimesheetStatusIdentifier(o2) : o1 === o2;
  }

  addTimesheetStatusToCollectionIfMissing<Type extends Pick<ITimesheetStatus, 'timesheetStatusId'>>(
    timesheetStatusCollection: Type[],
    ...timesheetStatusesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const timesheetStatuses: Type[] = timesheetStatusesToCheck.filter(isPresent);
    if (timesheetStatuses.length > 0) {
      const timesheetStatusCollectionIdentifiers = timesheetStatusCollection.map(
        timesheetStatusItem => this.getTimesheetStatusIdentifier(timesheetStatusItem)!
      );
      const timesheetStatusesToAdd = timesheetStatuses.filter(timesheetStatusItem => {
        const timesheetStatusIdentifier = this.getTimesheetStatusIdentifier(timesheetStatusItem);
        if (timesheetStatusCollectionIdentifiers.includes(timesheetStatusIdentifier)) {
          return false;
        }
        timesheetStatusCollectionIdentifiers.push(timesheetStatusIdentifier);
        return true;
      });
      return [...timesheetStatusesToAdd, ...timesheetStatusCollection];
    }
    return timesheetStatusCollection;
  }
}
