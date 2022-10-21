import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TimesheetService } from '../service/timesheet.service';

import { TimesheetComponent } from './timesheet.component';

describe('Timesheet Management Component', () => {
  let comp: TimesheetComponent;
  let fixture: ComponentFixture<TimesheetComponent>;
  let service: TimesheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'timesheet', component: TimesheetComponent }]), HttpClientTestingModule],
      declarations: [TimesheetComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'timesheetId,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'timesheetId,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(TimesheetComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TimesheetComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TimesheetService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ timesheetId: 123 }],
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
    expect(comp.timesheets?.[0]).toEqual(expect.objectContaining({ timesheetId: 123 }));
  });

  describe('trackTimesheetId', () => {
    it('Should forward to timesheetService', () => {
      const entity = { timesheetId: 123 };
      jest.spyOn(service, 'getTimesheetIdentifier');
      const timesheetId = comp.trackTimesheetId(0, entity);
      expect(service.getTimesheetIdentifier).toHaveBeenCalledWith(entity);
      expect(timesheetId).toBe(entity.timesheetId);
    });
  });
});
