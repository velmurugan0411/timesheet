import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimeoffTypeDetailComponent } from './timeoff-type-detail.component';

describe('TimeoffType Management Detail Component', () => {
  let comp: TimeoffTypeDetailComponent;
  let fixture: ComponentFixture<TimeoffTypeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeoffTypeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ timeoffType: { timeoffTypeId: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TimeoffTypeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TimeoffTypeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load timeoffType on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.timeoffType).toEqual(expect.objectContaining({ timeoffTypeId: 123 }));
    });
  });
});
