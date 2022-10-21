import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TimeoffTypeService } from '../service/timeoff-type.service';

import { TimeoffTypeComponent } from './timeoff-type.component';

describe('TimeoffType Management Component', () => {
  let comp: TimeoffTypeComponent;
  let fixture: ComponentFixture<TimeoffTypeComponent>;
  let service: TimeoffTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'timeoff-type', component: TimeoffTypeComponent }]), HttpClientTestingModule],
      declarations: [TimeoffTypeComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'timeoffTypeId,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'timeoffTypeId,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(TimeoffTypeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TimeoffTypeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TimeoffTypeService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ timeoffTypeId: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.timeoffTypes?.[0]).toEqual(expect.objectContaining({ timeoffTypeId: 123 }));
  });

  describe('trackTimeoffTypeId', () => {
    it('Should forward to timeoffTypeService', () => {
      const entity = { timeoffTypeId: 123 };
      jest.spyOn(service, 'getTimeoffTypeIdentifier');
      const timeoffTypeId = comp.trackTimeoffTypeId(0, entity);
      expect(service.getTimeoffTypeIdentifier).toHaveBeenCalledWith(entity);
      expect(timeoffTypeId).toBe(entity.timeoffTypeId);
    });
  });
});
