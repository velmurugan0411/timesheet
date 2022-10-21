import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ITimesheetDetails } from '../timesheet-details.model';
import { TimesheetDetailsService } from '../service/timesheet-details.service';

import { TimesheetDetailsRoutingResolveService } from './timesheet-details-routing-resolve.service';

describe('TimesheetDetails routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TimesheetDetailsRoutingResolveService;
  let service: TimesheetDetailsService;
  let resultTimesheetDetails: ITimesheetDetails | null | undefined;

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
    routingResolveService = TestBed.inject(TimesheetDetailsRoutingResolveService);
    service = TestBed.inject(TimesheetDetailsService);
    resultTimesheetDetails = undefined;
  });

  describe('resolve', () => {
    it('should return ITimesheetDetails returned by find', () => {
      // GIVEN
      service.find = jest.fn(timesheetDetailsId => of(new HttpResponse({ body: { timesheetDetailsId } })));
      mockActivatedRouteSnapshot.params = { timesheetDetailsId: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTimesheetDetails = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTimesheetDetails).toEqual({ timesheetDetailsId: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTimesheetDetails = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTimesheetDetails).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<ITimesheetDetails>({ body: null })));
      mockActivatedRouteSnapshot.params = { timesheetDetailsId: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTimesheetDetails = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTimesheetDetails).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
