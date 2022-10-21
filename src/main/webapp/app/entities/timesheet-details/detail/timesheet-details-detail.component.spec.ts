import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimesheetDetailsDetailComponent } from './timesheet-details-detail.component';

describe('TimesheetDetails Management Detail Component', () => {
  let comp: TimesheetDetailsDetailComponent;
  let fixture: ComponentFixture<TimesheetDetailsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimesheetDetailsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ timesheetDetails: { timesheetDetailsId: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TimesheetDetailsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TimesheetDetailsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load timesheetDetails on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.timesheetDetails).toEqual(expect.objectContaining({ timesheetDetailsId: 123 }));
    });
  });
});
