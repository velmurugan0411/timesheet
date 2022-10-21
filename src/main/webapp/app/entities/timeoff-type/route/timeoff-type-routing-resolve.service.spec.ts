import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ITimeoffType } from '../timeoff-type.model';
import { TimeoffTypeService } from '../service/timeoff-type.service';

import { TimeoffTypeRoutingResolveService } from './timeoff-type-routing-resolve.service';

describe('TimeoffType routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TimeoffTypeRoutingResolveService;
  let service: TimeoffTypeService;
  let resultTimeoffType: ITimeoffType | null | undefined;

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
    routingResolveService = TestBed.inject(TimeoffTypeRoutingResolveService);
    service = TestBed.inject(TimeoffTypeService);
    resultTimeoffType = undefined;
  });

  describe('resolve', () => {
    it('should return ITimeoffType returned by find', () => {
      // GIVEN
      service.find = jest.fn(timeoffTypeId => of(new HttpResponse({ body: { timeoffTypeId } })));
      mockActivatedRouteSnapshot.params = { timeoffTypeId: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTimeoffType = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTimeoffType).toEqual({ timeoffTypeId: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTimeoffType = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTimeoffType).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<ITimeoffType>({ body: null })));
      mockActivatedRouteSnapshot.params = { timeoffTypeId: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTimeoffType = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTimeoffType).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
