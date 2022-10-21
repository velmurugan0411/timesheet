import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITimeoffType, NewTimeoffType } from '../timeoff-type.model';

export type PartialUpdateTimeoffType = Partial<ITimeoffType> & Pick<ITimeoffType, 'timeoffTypeId'>;

export type EntityResponseType = HttpResponse<ITimeoffType>;
export type EntityArrayResponseType = HttpResponse<ITimeoffType[]>;

@Injectable({ providedIn: 'root' })
export class TimeoffTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/timeoff-types');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(timeoffType: NewTimeoffType): Observable<EntityResponseType> {
    return this.http.post<ITimeoffType>(this.resourceUrl, timeoffType, { observe: 'response' });
  }

  update(timeoffType: ITimeoffType): Observable<EntityResponseType> {
    return this.http.put<ITimeoffType>(`${this.resourceUrl}/${this.getTimeoffTypeIdentifier(timeoffType)}`, timeoffType, {
      observe: 'response',
    });
  }

  partialUpdate(timeoffType: PartialUpdateTimeoffType): Observable<EntityResponseType> {
    return this.http.patch<ITimeoffType>(`${this.resourceUrl}/${this.getTimeoffTypeIdentifier(timeoffType)}`, timeoffType, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITimeoffType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITimeoffType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTimeoffTypeIdentifier(timeoffType: Pick<ITimeoffType, 'timeoffTypeId'>): number {
    return timeoffType.timeoffTypeId;
  }

  compareTimeoffType(o1: Pick<ITimeoffType, 'timeoffTypeId'> | null, o2: Pick<ITimeoffType, 'timeoffTypeId'> | null): boolean {
    return o1 && o2 ? this.getTimeoffTypeIdentifier(o1) === this.getTimeoffTypeIdentifier(o2) : o1 === o2;
  }

  addTimeoffTypeToCollectionIfMissing<Type extends Pick<ITimeoffType, 'timeoffTypeId'>>(
    timeoffTypeCollection: Type[],
    ...timeoffTypesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const timeoffTypes: Type[] = timeoffTypesToCheck.filter(isPresent);
    if (timeoffTypes.length > 0) {
      const timeoffTypeCollectionIdentifiers = timeoffTypeCollection.map(
        timeoffTypeItem => this.getTimeoffTypeIdentifier(timeoffTypeItem)!
      );
      const timeoffTypesToAdd = timeoffTypes.filter(timeoffTypeItem => {
        const timeoffTypeIdentifier = this.getTimeoffTypeIdentifier(timeoffTypeItem);
        if (timeoffTypeCollectionIdentifiers.includes(timeoffTypeIdentifier)) {
          return false;
        }
        timeoffTypeCollectionIdentifiers.push(timeoffTypeIdentifier);
        return true;
      });
      return [...timeoffTypesToAdd, ...timeoffTypeCollection];
    }
    return timeoffTypeCollection;
  }
}
