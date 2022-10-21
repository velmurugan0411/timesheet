import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ITimesheet } from '../timesheet.model';
import { TimesheetService } from '../service/timesheet.service';

import { TimesheetRoutingResolveService } from './timesheet-routing-resolve.service';

describe('Timesheet routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TimesheetRoutingResolveService;
  let service: TimesheetService;
  let resultTimesheet: ITimesheet | null | undefined;

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
    routingResolveService = TestBed.inject(TimesheetRoutingResolveService);
    service = TestBed.inject(TimesheetService);
    resultTimesheet = undefined;
  });

  describe('resolve', () => {
    it('should return ITimesheet returned by find', () => {
      // GIVEN
      service.find = jest.fn(timesheetId => of(new HttpResponse({ body: { timesheetId } })));
      mockActivatedRouteSnapshot.params = { timesheetId: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTimesheet = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTimesheet).toEqual({ timesheetId: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTimesheet = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTimesheet).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<ITimesheet>({ body: null })));
      mockActivatedRouteSnapshot.params = { timesheetId: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTimesheet = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTimesheet).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
