import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TimeoffTypeFormService } from './timeoff-type-form.service';
import { TimeoffTypeService } from '../service/timeoff-type.service';
import { ITimeoffType } from '../timeoff-type.model';

import { TimeoffTypeUpdateComponent } from './timeoff-type-update.component';

describe('TimeoffType Management Update Component', () => {
  let comp: TimeoffTypeUpdateComponent;
  let fixture: ComponentFixture<TimeoffTypeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let timeoffTypeFormService: TimeoffTypeFormService;
  let timeoffTypeService: TimeoffTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TimeoffTypeUpdateComponent],
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
      .overrideTemplate(TimeoffTypeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TimeoffTypeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    timeoffTypeFormService = TestBed.inject(TimeoffTypeFormService);
    timeoffTypeService = TestBed.inject(TimeoffTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const timeoffType: ITimeoffType = { timeoffTypeId: 456 };

      activatedRoute.data = of({ timeoffType });
      comp.ngOnInit();

      expect(comp.timeoffType).toEqual(timeoffType);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimeoffType>>();
      const timeoffType = { timeoffTypeId: 123 };
      jest.spyOn(timeoffTypeFormService, 'getTimeoffType').mockReturnValue(timeoffType);
      jest.spyOn(timeoffTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timeoffType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: timeoffType }));
      saveSubject.complete();

      // THEN
      expect(timeoffTypeFormService.getTimeoffType).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(timeoffTypeService.update).toHaveBeenCalledWith(expect.objectContaining(timeoffType));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimeoffType>>();
      const timeoffType = { timeoffTypeId: 123 };
      jest.spyOn(timeoffTypeFormService, 'getTimeoffType').mockReturnValue({ timeoffTypeId: null });
      jest.spyOn(timeoffTypeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timeoffType: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: timeoffType }));
      saveSubject.complete();

      // THEN
      expect(timeoffTypeFormService.getTimeoffType).toHaveBeenCalled();
      expect(timeoffTypeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimeoffType>>();
      const timeoffType = { timeoffTypeId: 123 };
      jest.spyOn(timeoffTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timeoffType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(timeoffTypeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
