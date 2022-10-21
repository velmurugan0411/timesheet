import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IUserTask } from '../user-task.model';
import { UserTaskService } from '../service/user-task.service';

import { UserTaskRoutingResolveService } from './user-task-routing-resolve.service';

describe('UserTask routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: UserTaskRoutingResolveService;
  let service: UserTaskService;
  let resultUserTask: IUserTask | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(UserTaskRoutingResolveService);
    service = TestBed.inject(UserTaskService);
    resultUserTask = undefined;
  });

  describe('resolve', () => {
    it('should return IUserTask returned by find', () => {
      // GIVEN
      service.find = jest.fn(userTaskId => of(new HttpResponse({ body: { userTaskId } })));
      mockActivatedRouteSnapshot.params = { userTaskId: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUserTask = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultUserTask).toEqual({ userTaskId: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUserTask = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultUserTask).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IUserTask>({ body: null })));
      mockActivatedRouteSnapshot.params = { userTaskId: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUserTask = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultUserTask).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
