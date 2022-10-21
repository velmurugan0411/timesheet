import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserTaskFormService } from './user-task-form.service';
import { UserTaskService } from '../service/user-task.service';
import { IUserTask } from '../user-task.model';

import { UserTaskUpdateComponent } from './user-task-update.component';

describe('UserTask Management Update Component', () => {
  let comp: UserTaskUpdateComponent;
  let fixture: ComponentFixture<UserTaskUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userTaskFormService: UserTaskFormService;
  let userTaskService: UserTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserTaskUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(UserTaskUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserTaskUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userTaskFormService = TestBed.inject(UserTaskFormService);
    userTaskService = TestBed.inject(UserTaskService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const userTask: IUserTask = { userTaskId: 456 };

      activatedRoute.data = of({ userTask });
      comp.ngOnInit();

      expect(comp.userTask).toEqual(userTask);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserTask>>();
      const userTask = { userTaskId: 123 };
      jest.spyOn(userTaskFormService, 'getUserTask').mockReturnValue(userTask);
      jest.spyOn(userTaskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userTask });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userTask }));
      saveSubject.complete();

      // THEN
      expect(userTaskFormService.getUserTask).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userTaskService.update).toHaveBeenCalledWith(expect.objectContaining(userTask));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserTask>>();
      const userTask = { userTaskId: 123 };
      jest.spyOn(userTaskFormService, 'getUserTask').mockReturnValue({ userTaskId: null });
      jest.spyOn(userTaskService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userTask: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userTask }));
      saveSubject.complete();

      // THEN
      expect(userTaskFormService.getUserTask).toHaveBeenCalled();
      expect(userTaskService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserTask>>();
      const userTask = { userTaskId: 123 };
      jest.spyOn(userTaskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userTask });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userTaskService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
