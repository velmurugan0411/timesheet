import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITimesheetStatus } from '../timesheet-status.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../timesheet-status.test-samples';

import { TimesheetStatusService } from './timesheet-status.service';

const requireRestSample: ITimesheetStatus = {
  ...sampleWithRequiredData,
};

describe('TimesheetStatus Service', () => {
  let service: TimesheetStatusService;
  let httpMock: HttpTestingController;
  let expectedResult: ITimesheetStatus | ITimesheetStatus[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TimesheetStatusService);
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

    it('should create a TimesheetStatus', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const timesheetStatus = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(timesheetStatus).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TimesheetStatus', () => {
      const timesheetStatus = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(timesheetStatus).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TimesheetStatus', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TimesheetStatus', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TimesheetStatus', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTimesheetStatusToCollectionIfMissing', () => {
      it('should add a TimesheetStatus to an empty array', () => {
        const timesheetStatus: ITimesheetStatus = sampleWithRequiredData;
        expectedResult = service.addTimesheetStatusToCollectionIfMissing([], timesheetStatus);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(timesheetStatus);
      });

      it('should not add a TimesheetStatus to an array that contains it', () => {
        const timesheetStatus: ITimesheetStatus = sampleWithRequiredData;
        const timesheetStatusCollection: ITimesheetStatus[] = [
          {
            ...timesheetStatus,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTimesheetStatusToCollectionIfMissing(timesheetStatusCollection, timesheetStatus);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TimesheetStatus to an array that doesn't contain it", () => {
        const timesheetStatus: ITimesheetStatus = sampleWithRequiredData;
        const timesheetStatusCollection: ITimesheetStatus[] = [sampleWithPartialData];
        expectedResult = service.addTimesheetStatusToCollectionIfMissing(timesheetStatusCollection, timesheetStatus);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(timesheetStatus);
      });

      it('should add only unique TimesheetStatus to an array', () => {
        const timesheetStatusArray: ITimesheetStatus[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const timesheetStatusCollection: ITimesheetStatus[] = [sampleWithRequiredData];
        expectedResult = service.addTimesheetStatusToCollectionIfMissing(timesheetStatusCollection, ...timesheetStatusArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const timesheetStatus: ITimesheetStatus = sampleWithRequiredData;
        const timesheetStatus2: ITimesheetStatus = sampleWithPartialData;
        expectedResult = service.addTimesheetStatusToCollectionIfMissing([], timesheetStatus, timesheetStatus2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(timesheetStatus);
        expect(expectedResult).toContain(timesheetStatus2);
      });

      it('should accept null and undefined values', () => {
        const timesheetStatus: ITimesheetStatus = sampleWithRequiredData;
        expectedResult = service.addTimesheetStatusToCollectionIfMissing([], null, timesheetStatus, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(timesheetStatus);
      });

      it('should return initial array if no TimesheetStatus is added', () => {
        const timesheetStatusCollection: ITimesheetStatus[] = [sampleWithRequiredData];
        expectedResult = service.addTimesheetStatusToCollectionIfMissing(timesheetStatusCollection, undefined, null);
        expect(expectedResult).toEqual(timesheetStatusCollection);
      });
    });

    describe('compareTimesheetStatus', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTimesheetStatus(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { timesheetStatusId: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTimesheetStatus(entity1, entity2);
        const compareResult2 = service.compareTimesheetStatus(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { timesheetStatusId: 123 };
        const entity2 = { timesheetStatusId: 456 };

        const compareResult1 = service.compareTimesheetStatus(entity1, entity2);
        const compareResult2 = service.compareTimesheetStatus(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { timesheetStatusId: 123 };
        const entity2 = { timesheetStatusId: 123 };

        const compareResult1 = service.compareTimesheetStatus(entity1, entity2);
        const compareResult2 = service.compareTimesheetStatus(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
