import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TimesheetDetailsService } from '../service/timesheet-details.service';

import { TimesheetDetailsComponent } from './timesheet-details.component';

describe('TimesheetDetails Management Component', () => {
  let comp: TimesheetDetailsComponent;
  let fixture: ComponentFixture<TimesheetDetailsComponent>;
  let service: TimesheetDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'timesheet-details', component: TimesheetDetailsComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [TimesheetDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'timesheetDetailsId,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'timesheetDetailsId,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(TimesheetDetailsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TimesheetDetailsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TimesheetDetailsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ timesheetDetailsId: 123 }],
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
    expect(comp.timesheetDetails?.[0]).toEqual(expect.objectContaining({ timesheetDetailsId: 123 }));
  });

  describe('trackTimesheetDetailsId', () => {
    it('Should forward to timesheetDetailsService', () => {
      const entity = { timesheetDetailsId: 123 };
      jest.spyOn(service, 'getTimesheetDetailsIdentifier');
      const timesheetDetailsId = comp.trackTimesheetDetailsId(0, entity);
      expect(service.getTimesheetDetailsIdentifier).toHaveBeenCalledWith(entity);
      expect(timesheetDetailsId).toBe(entity.timesheetDetailsId);
    });
  });
});
