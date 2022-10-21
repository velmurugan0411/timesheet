import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserTaskService } from '../service/user-task.service';

import { UserTaskComponent } from './user-task.component';

describe('UserTask Management Component', () => {
  let comp: UserTaskComponent;
  let fixture: ComponentFixture<UserTaskComponent>;
  let service: UserTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-task', component: UserTaskComponent }]), HttpClientTestingModule],
      declarations: [UserTaskComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'userTaskId,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'userTaskId,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(UserTaskComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserTaskComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserTaskService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ userTaskId: 123 }],
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
    expect(comp.userTasks?.[0]).toEqual(expect.objectContaining({ userTaskId: 123 }));
  });

  describe('trackUserTaskId', () => {
    it('Should forward to userTaskService', () => {
      const entity = { userTaskId: 123 };
      jest.spyOn(service, 'getUserTaskIdentifier');
      const userTaskId = comp.trackUserTaskId(0, entity);
      expect(service.getUserTaskIdentifier).toHaveBeenCalledWith(entity);
      expect(userTaskId).toBe(entity.userTaskId);
    });
  });
});
