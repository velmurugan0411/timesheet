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

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';

import { UserTaskUpdateComponent } from './user-task-update.component';

describe('UserTask Management Update Component', () => {
  let comp: UserTaskUpdateComponent;
  let fixture: ComponentFixture<UserTaskUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userTaskFormService: UserTaskFormService;
  let userTaskService: UserTaskService;
  let userService: UserService;
  let taskService: TaskService;

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
    userService = TestBed.inject(UserService);
    taskService = TestBed.inject(TaskService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userTask: IUserTask = { userTaskId: 456 };
      const userId: IUser = { id: 70481 };
      userTask.userId = userId;

      const userCollection: IUser[] = [{ id: 28622 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [userId];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userTask });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Task query and add missing value', () => {
      const userTask: IUserTask = { userTaskId: 456 };
      const taskId: ITask = { taskId: 64225 };
      userTask.taskId = taskId;

      const taskCollection: ITask[] = [{ taskId: 77271 }];
      jest.spyOn(taskService, 'query').mockReturnValue(of(new HttpResponse({ body: taskCollection })));
      const additionalTasks = [taskId];
      const expectedCollection: ITask[] = [...additionalTasks, ...taskCollection];
      jest.spyOn(taskService, 'addTaskToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userTask });
      comp.ngOnInit();

      expect(taskService.query).toHaveBeenCalled();
      expect(taskService.addTaskToCollectionIfMissing).toHaveBeenCalledWith(
        taskCollection,
        ...additionalTasks.map(expect.objectContaining)
      );
      expect(comp.tasksSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userTask: IUserTask = { userTaskId: 456 };
      const userId: IUser = { id: 38513 };
      userTask.userId = userId;
      const taskId: ITask = { taskId: 18969 };
      userTask.taskId = taskId;

      activatedRoute.data = of({ userTask });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(userId);
      expect(comp.tasksSharedCollection).toContain(taskId);
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

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTask', () => {
      it('Should forward to taskService', () => {
        const entity = { taskId: 123 };
        const entity2 = { taskId: 456 };
        jest.spyOn(taskService, 'compareTask');
        comp.compareTask(entity, entity2);
        expect(taskService.compareTask).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
