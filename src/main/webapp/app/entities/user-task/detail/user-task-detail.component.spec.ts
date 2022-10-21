import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserTaskDetailComponent } from './user-task-detail.component';

describe('UserTask Management Detail Component', () => {
  let comp: UserTaskDetailComponent;
  let fixture: ComponentFixture<UserTaskDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserTaskDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userTask: { userTaskId: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserTaskDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserTaskDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userTask on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userTask).toEqual(expect.objectContaining({ userTaskId: 123 }));
    });
  });
});
