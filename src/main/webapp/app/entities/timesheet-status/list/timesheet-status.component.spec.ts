import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TimesheetStatusService } from '../service/timesheet-status.service';

import { TimesheetStatusComponent } from './timesheet-status.component';

describe('TimesheetStatus Management Component', () => {
  let comp: TimesheetStatusComponent;
  let fixture: ComponentFixture<TimesheetStatusComponent>;
  let service: TimesheetStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'timesheet-status', component: TimesheetStatusComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [TimesheetStatusComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'timesheetStatusId,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'timesheetStatusId,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(TimesheetStatusComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TimesheetStatusComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TimesheetStatusService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ timesheetStatusId: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.timesheetStatuses?.[0]).toEqual(expect.objectContaining({ timesheetStatusId: 123 }));
  });

  describe('trackTimesheetStatusId', () => {
    it('Should forward to timesheetStatusService', () => {
      const entity = { timesheetStatusId: 123 };
      jest.spyOn(service, 'getTimesheetStatusIdentifier');
      const timesheetStatusId = comp.trackTimesheetStatusId(0, entity);
      expect(service.getTimesheetStatusIdentifier).toHaveBeenCalledWith(entity);
      expect(timesheetStatusId).toBe(entity.timesheetStatusId);
    });
  });
});
