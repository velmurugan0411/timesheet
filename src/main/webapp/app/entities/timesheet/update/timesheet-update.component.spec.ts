import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TimesheetFormService } from './timesheet-form.service';
import { TimesheetService } from '../service/timesheet.service';
import { ITimesheet } from '../timesheet.model';
import { ITimesheetStatus } from 'app/entities/timesheet-status/timesheet-status.model';
import { TimesheetStatusService } from 'app/entities/timesheet-status/service/timesheet-status.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { TimesheetUpdateComponent } from './timesheet-update.component';

describe('Timesheet Management Update Component', () => {
  let comp: TimesheetUpdateComponent;
  let fixture: ComponentFixture<TimesheetUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let timesheetFormService: TimesheetFormService;
  let timesheetService: TimesheetService;
  let timesheetStatusService: TimesheetStatusService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TimesheetUpdateComponent],
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
      .overrideTemplate(TimesheetUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TimesheetUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    timesheetFormService = TestBed.inject(TimesheetFormService);
    timesheetService = TestBed.inject(TimesheetService);
    timesheetStatusService = TestBed.inject(TimesheetStatusService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TimesheetStatus query and add missing value', () => {
      const timesheet: ITimesheet = { timesheetId: 456 };
      const timesheetStatusId: ITimesheetStatus = { timesheetStatusId: 96795 };
      timesheet.timesheetStatusId = timesheetStatusId;

      const timesheetStatusCollection: ITimesheetStatus[] = [{ timesheetStatusId: 44656 }];
      jest.spyOn(timesheetStatusService, 'query').mockReturnValue(of(new HttpResponse({ body: timesheetStatusCollection })));
      const additionalTimesheetStatuses = [timesheetStatusId];
      const expectedCollection: ITimesheetStatus[] = [...additionalTimesheetStatuses, ...timesheetStatusCollection];
      jest.spyOn(timesheetStatusService, 'addTimesheetStatusToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ timesheet });
      comp.ngOnInit();

      expect(timesheetStatusService.query).toHaveBeenCalled();
      expect(timesheetStatusService.addTimesheetStatusToCollectionIfMissing).toHaveBeenCalledWith(
        timesheetStatusCollection,
        ...additionalTimesheetStatuses.map(expect.objectContaining)
      );
      expect(comp.timesheetStatusesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const timesheet: ITimesheet = { timesheetId: 456 };
      const userId: IUser = { id: 39292 };
      timesheet.userId = userId;

      const userCollection: IUser[] = [{ id: 77763 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [userId];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ timesheet });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const timesheet: ITimesheet = { timesheetId: 456 };
      const timesheetStatusId: ITimesheetStatus = { timesheetStatusId: 4293 };
      timesheet.timesheetStatusId = timesheetStatusId;
      const userId: IUser = { id: 1179 };
      timesheet.userId = userId;

      activatedRoute.data = of({ timesheet });
      comp.ngOnInit();

      expect(comp.timesheetStatusesSharedCollection).toContain(timesheetStatusId);
      expect(comp.usersSharedCollection).toContain(userId);
      expect(comp.timesheet).toEqual(timesheet);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimesheet>>();
      const timesheet = { timesheetId: 123 };
      jest.spyOn(timesheetFormService, 'getTimesheet').mockReturnValue(timesheet);
      jest.spyOn(timesheetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timesheet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: timesheet }));
      saveSubject.complete();

      // THEN
      expect(timesheetFormService.getTimesheet).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(timesheetService.update).toHaveBeenCalledWith(expect.objectContaining(timesheet));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimesheet>>();
      const timesheet = { timesheetId: 123 };
      jest.spyOn(timesheetFormService, 'getTimesheet').mockReturnValue({ timesheetId: null });
      jest.spyOn(timesheetService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timesheet: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: timesheet }));
      saveSubject.complete();

      // THEN
      expect(timesheetFormService.getTimesheet).toHaveBeenCalled();
      expect(timesheetService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimesheet>>();
      const timesheet = { timesheetId: 123 };
      jest.spyOn(timesheetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timesheet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(timesheetService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTimesheetStatus', () => {
      it('Should forward to timesheetStatusService', () => {
        const entity = { timesheetStatusId: 123 };
        const entity2 = { timesheetStatusId: 456 };
        jest.spyOn(timesheetStatusService, 'compareTimesheetStatus');
        comp.compareTimesheetStatus(entity, entity2);
        expect(timesheetStatusService.compareTimesheetStatus).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
