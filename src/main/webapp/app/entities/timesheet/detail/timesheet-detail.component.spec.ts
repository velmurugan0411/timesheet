import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimesheetDetailComponent } from './timesheet-detail.component';

describe('Timesheet Management Detail Component', () => {
  let comp: TimesheetDetailComponent;
  let fixture: ComponentFixture<TimesheetDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimesheetDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ timesheet: { timesheetId: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TimesheetDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TimesheetDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load timesheet on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.timesheet).toEqual(expect.objectContaining({ timesheetId: 123 }));
    });
  });
});
