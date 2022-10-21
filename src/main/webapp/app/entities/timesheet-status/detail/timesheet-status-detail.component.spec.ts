import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimesheetStatusDetailComponent } from './timesheet-status-detail.component';

describe('TimesheetStatus Management Detail Component', () => {
  let comp: TimesheetStatusDetailComponent;
  let fixture: ComponentFixture<TimesheetStatusDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimesheetStatusDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ timesheetStatus: { timesheetStatusId: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TimesheetStatusDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TimesheetStatusDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load timesheetStatus on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.timesheetStatus).toEqual(expect.objectContaining({ timesheetStatusId: 123 }));
    });
  });
});
