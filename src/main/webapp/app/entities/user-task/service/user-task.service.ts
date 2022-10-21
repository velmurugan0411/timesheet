import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserTask, NewUserTask } from '../user-task.model';

export type PartialUpdateUserTask = Partial<IUserTask> & Pick<IUserTask, 'userTaskId'>;

export type EntityResponseType = HttpResponse<IUserTask>;
export type EntityArrayResponseType = HttpResponse<IUserTask[]>;

@Injectable({ providedIn: 'root' })
export class UserTaskService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-tasks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userTask: NewUserTask): Observable<EntityResponseType> {
    return this.http.post<IUserTask>(this.resourceUrl, userTask, { observe: 'response' });
  }

  update(userTask: IUserTask): Observable<EntityResponseType> {
    return this.http.put<IUserTask>(`${this.resourceUrl}/${this.getUserTaskIdentifier(userTask)}`, userTask, { observe: 'response' });
  }

  partialUpdate(userTask: PartialUpdateUserTask): Observable<EntityResponseType> {
    return this.http.patch<IUserTask>(`${this.resourceUrl}/${this.getUserTaskIdentifier(userTask)}`, userTask, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserTask>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserTask[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserTaskIdentifier(userTask: Pick<IUserTask, 'userTaskId'>): number {
    return userTask.userTaskId;
  }

  compareUserTask(o1: Pick<IUserTask, 'userTaskId'> | null, o2: Pick<IUserTask, 'userTaskId'> | null): boolean {
    return o1 && o2 ? this.getUserTaskIdentifier(o1) === this.getUserTaskIdentifier(o2) : o1 === o2;
  }

  addUserTaskToCollectionIfMissing<Type extends Pick<IUserTask, 'userTaskId'>>(
    userTaskCollection: Type[],
    ...userTasksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userTasks: Type[] = userTasksToCheck.filter(isPresent);
    if (userTasks.length > 0) {
      const userTaskCollectionIdentifiers = userTaskCollection.map(userTaskItem => this.getUserTaskIdentifier(userTaskItem)!);
      const userTasksToAdd = userTasks.filter(userTaskItem => {
        const userTaskIdentifier = this.getUserTaskIdentifier(userTaskItem);
        if (userTaskCollectionIdentifiers.includes(userTaskIdentifier)) {
          return false;
        }
        userTaskCollectionIdentifiers.push(userTaskIdentifier);
        return true;
      });
      return [...userTasksToAdd, ...userTaskCollection];
    }
    return userTaskCollection;
  }
}
