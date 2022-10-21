import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserTask } from '../user-task.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-task.test-samples';

import { UserTaskService } from './user-task.service';

const requireRestSample: IUserTask = {
  ...sampleWithRequiredData,
};

describe('UserTask Service', () => {
  let service: UserTaskService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserTask | IUserTask[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserTaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a UserTask', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userTask = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userTask).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserTask', () => {
      const userTask = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userTask).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserTask', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserTask', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserTask', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addUserTaskToCollectionIfMissing', () => {
      it('should add a UserTask to an empty array', () => {
        const userTask: IUserTask = sampleWithRequiredData;
        expectedResult = service.addUserTaskToCollectionIfMissing([], userTask);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userTask);
      });

      it('should not add a UserTask to an array that contains it', () => {
        const userTask: IUserTask = sampleWithRequiredData;
        const userTaskCollection: IUserTask[] = [
          {
            ...userTask,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserTaskToCollectionIfMissing(userTaskCollection, userTask);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserTask to an array that doesn't contain it", () => {
        const userTask: IUserTask = sampleWithRequiredData;
        const userTaskCollection: IUserTask[] = [sampleWithPartialData];
        expectedResult = service.addUserTaskToCollectionIfMissing(userTaskCollection, userTask);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userTask);
      });

      it('should add only unique UserTask to an array', () => {
        const userTaskArray: IUserTask[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userTaskCollection: IUserTask[] = [sampleWithRequiredData];
        expectedResult = service.addUserTaskToCollectionIfMissing(userTaskCollection, ...userTaskArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userTask: IUserTask = sampleWithRequiredData;
        const userTask2: IUserTask = sampleWithPartialData;
        expectedResult = service.addUserTaskToCollectionIfMissing([], userTask, userTask2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userTask);
        expect(expectedResult).toContain(userTask2);
      });

      it('should accept null and undefined values', () => {
        const userTask: IUserTask = sampleWithRequiredData;
        expectedResult = service.addUserTaskToCollectionIfMissing([], null, userTask, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userTask);
      });

      it('should return initial array if no UserTask is added', () => {
        const userTaskCollection: IUserTask[] = [sampleWithRequiredData];
        expectedResult = service.addUserTaskToCollectionIfMissing(userTaskCollection, undefined, null);
        expect(expectedResult).toEqual(userTaskCollection);
      });
    });

    describe('compareUserTask', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserTask(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { userTaskId: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserTask(entity1, entity2);
        const compareResult2 = service.compareUserTask(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { userTaskId: 123 };
        const entity2 = { userTaskId: 456 };

        const compareResult1 = service.compareUserTask(entity1, entity2);
        const compareResult2 = service.compareUserTask(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { userTaskId: 123 };
        const entity2 = { userTaskId: 123 };

        const compareResult1 = service.compareUserTask(entity1, entity2);
        const compareResult2 = service.compareUserTask(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
