import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TimesheetDetailsFormService } from './timesheet-details-form.service';
import { TimesheetDetailsService } from '../service/timesheet-details.service';
import { ITimesheetDetails } from '../timesheet-details.model';
import { ITimeoffType } from 'app/entities/timeoff-type/timeoff-type.model';
import { TimeoffTypeService } from 'app/entities/timeoff-type/service/timeoff-type.service';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';
import { ITimesheet } from 'app/entities/timesheet/timesheet.model';
import { TimesheetService } from 'app/entities/timesheet/service/timesheet.service';

import { TimesheetDetailsUpdateComponent } from './timesheet-details-update.component';

describe('TimesheetDetails Management Update Component', () => {
  let comp: TimesheetDetailsUpdateComponent;
  let fixture: ComponentFixture<TimesheetDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let timesheetDetailsFormService: TimesheetDetailsFormService;
  let timesheetDetailsService: TimesheetDetailsService;
  let timeoffTypeService: TimeoffTypeService;
  let taskService: TaskService;
  let timesheetService: TimesheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TimesheetDetailsUpdateComponent],
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
      .overrideTemplate(TimesheetDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TimesheetDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    timesheetDetailsFormService = TestBed.inject(TimesheetDetailsFormService);
    timesheetDetailsService = TestBed.inject(TimesheetDetailsService);
    timeoffTypeService = TestBed.inject(TimeoffTypeService);
    taskService = TestBed.inject(TaskService);
    timesheetService = TestBed.inject(TimesheetService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TimeoffType query and add missing value', () => {
      const timesheetDetails: ITimesheetDetails = { timesheetDetailsId: 456 };
      const timeoffTypeId: ITimeoffType = { timeoffTypeId: 6260 };
      timesheetDetails.timeoffTypeId = timeoffTypeId;

      const timeoffTypeCollection: ITimeoffType[] = [{ timeoffTypeId: 87736 }];
      jest.spyOn(timeoffTypeService, 'query').mockReturnValue(of(new HttpResponse({ body: timeoffTypeCollection })));
      const additionalTimeoffTypes = [timeoffTypeId];
      const expectedCollection: ITimeoffType[] = [...additionalTimeoffTypes, ...timeoffTypeCollection];
      jest.spyOn(timeoffTypeService, 'addTimeoffTypeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ timesheetDetails });
      comp.ngOnInit();

      expect(timeoffTypeService.query).toHaveBeenCalled();
      expect(timeoffTypeService.addTimeoffTypeToCollectionIfMissing).toHaveBeenCalledWith(
        timeoffTypeCollection,
        ...additionalTimeoffTypes.map(expect.objectContaining)
      );
      expect(comp.timeoffTypesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Task query and add missing value', () => {
      const timesheetDetails: ITimesheetDetails = { timesheetDetailsId: 456 };
      const taskId: ITask = { taskId: 95609 };
      timesheetDetails.taskId = taskId;

      const taskCollection: ITask[] = [{ taskId: 68644 }];
      jest.spyOn(taskService, 'query').mockReturnValue(of(new HttpResponse({ body: taskCollection })));
      const additionalTasks = [taskId];
      const expectedCollection: ITask[] = [...additionalTasks, ...taskCollection];
      jest.spyOn(taskService, 'addTaskToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ timesheetDetails });
      comp.ngOnInit();

      expect(taskService.query).toHaveBeenCalled();
      expect(taskService.addTaskToCollectionIfMissing).toHaveBeenCalledWith(
        taskCollection,
        ...additionalTasks.map(expect.objectContaining)
      );
      expect(comp.tasksSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Timesheet query and add missing value', () => {
      const timesheetDetails: ITimesheetDetails = { timesheetDetailsId: 456 };
      const timesheetId: ITimesheet = { timesheetId: 8480 };
      timesheetDetails.timesheetId = timesheetId;

      const timesheetCollection: ITimesheet[] = [{ timesheetId: 86393 }];
      jest.spyOn(timesheetService, 'query').mockReturnValue(of(new HttpResponse({ body: timesheetCollection })));
      const additionalTimesheets = [timesheetId];
      const expectedCollection: ITimesheet[] = [...additionalTimesheets, ...timesheetCollection];
      jest.spyOn(timesheetService, 'addTimesheetToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ timesheetDetails });
      comp.ngOnInit();

      expect(timesheetService.query).toHaveBeenCalled();
      expect(timesheetService.addTimesheetToCollectionIfMissing).toHaveBeenCalledWith(
        timesheetCollection,
        ...additionalTimesheets.map(expect.objectContaining)
      );
      expect(comp.timesheetsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const timesheetDetails: ITimesheetDetails = { timesheetDetailsId: 456 };
      const timeoffTypeId: ITimeoffType = { timeoffTypeId: 62519 };
      timesheetDetails.timeoffTypeId = timeoffTypeId;
      const taskId: ITask = { taskId: 50549 };
      timesheetDetails.taskId = taskId;
      const timesheetId: ITimesheet = { timesheetId: 85467 };
      timesheetDetails.timesheetId = timesheetId;

      activatedRoute.data = of({ timesheetDetails });
      comp.ngOnInit();

      expect(comp.timeoffTypesSharedCollection).toContain(timeoffTypeId);
      expect(comp.tasksSharedCollection).toContain(taskId);
      expect(comp.timesheetsSharedCollection).toContain(timesheetId);
      expect(comp.timesheetDetails).toEqual(timesheetDetails);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimesheetDetails>>();
      const timesheetDetails = { timesheetDetailsId: 123 };
      jest.spyOn(timesheetDetailsFormService, 'getTimesheetDetails').mockReturnValue(timesheetDetails);
      jest.spyOn(timesheetDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timesheetDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: timesheetDetails }));
      saveSubject.complete();

      // THEN
      expect(timesheetDetailsFormService.getTimesheetDetails).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(timesheetDetailsService.update).toHaveBeenCalledWith(expect.objectContaining(timesheetDetails));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimesheetDetails>>();
      const timesheetDetails = { timesheetDetailsId: 123 };
      jest.spyOn(timesheetDetailsFormService, 'getTimesheetDetails').mockReturnValue({ timesheetDetailsId: null });
      jest.spyOn(timesheetDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timesheetDetails: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: timesheetDetails }));
      saveSubject.complete();

      // THEN
      expect(timesheetDetailsFormService.getTimesheetDetails).toHaveBeenCalled();
      expect(timesheetDetailsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimesheetDetails>>();
      const timesheetDetails = { timesheetDetailsId: 123 };
      jest.spyOn(timesheetDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timesheetDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(timesheetDetailsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTimeoffType', () => {
      it('Should forward to timeoffTypeService', () => {
        const entity = { timeoffTypeId: 123 };
        const entity2 = { timeoffTypeId: 456 };
        jest.spyOn(timeoffTypeService, 'compareTimeoffType');
        comp.compareTimeoffType(entity, entity2);
        expect(timeoffTypeService.compareTimeoffType).toHaveBeenCalledWith(entity, entity2);
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

    describe('compareTimesheet', () => {
      it('Should forward to timesheetService', () => {
        const entity = { timesheetId: 123 };
        const entity2 = { timesheetId: 456 };
        jest.spyOn(timesheetService, 'compareTimesheet');
        comp.compareTimesheet(entity, entity2);
        expect(timesheetService.compareTimesheet).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
