import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TimesheetStatusFormService } from './timesheet-status-form.service';
import { TimesheetStatusService } from '../service/timesheet-status.service';
import { ITimesheetStatus } from '../timesheet-status.model';

import { TimesheetStatusUpdateComponent } from './timesheet-status-update.component';

describe('TimesheetStatus Management Update Component', () => {
  let comp: TimesheetStatusUpdateComponent;
  let fixture: ComponentFixture<TimesheetStatusUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let timesheetStatusFormService: TimesheetStatusFormService;
  let timesheetStatusService: TimesheetStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TimesheetStatusUpdateComponent],
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
      .overrideTemplate(TimesheetStatusUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TimesheetStatusUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    timesheetStatusFormService = TestBed.inject(TimesheetStatusFormService);
    timesheetStatusService = TestBed.inject(TimesheetStatusService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const timesheetStatus: ITimesheetStatus = { timesheetStatusId: 456 };

      activatedRoute.data = of({ timesheetStatus });
      comp.ngOnInit();

      expect(comp.timesheetStatus).toEqual(timesheetStatus);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimesheetStatus>>();
      const timesheetStatus = { timesheetStatusId: 123 };
      jest.spyOn(timesheetStatusFormService, 'getTimesheetStatus').mockReturnValue(timesheetStatus);
      jest.spyOn(timesheetStatusService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timesheetStatus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: timesheetStatus }));
      saveSubject.complete();

      // THEN
      expect(timesheetStatusFormService.getTimesheetStatus).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(timesheetStatusService.update).toHaveBeenCalledWith(expect.objectContaining(timesheetStatus));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimesheetStatus>>();
      const timesheetStatus = { timesheetStatusId: 123 };
      jest.spyOn(timesheetStatusFormService, 'getTimesheetStatus').mockReturnValue({ timesheetStatusId: null });
      jest.spyOn(timesheetStatusService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timesheetStatus: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: timesheetStatus }));
      saveSubject.complete();

      // THEN
      expect(timesheetStatusFormService.getTimesheetStatus).toHaveBeenCalled();
      expect(timesheetStatusService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimesheetStatus>>();
      const timesheetStatus = { timesheetStatusId: 123 };
      jest.spyOn(timesheetStatusService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timesheetStatus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(timesheetStatusService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
