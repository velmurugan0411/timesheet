import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITimesheet } from '../timesheet.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../timesheet.test-samples';

import { TimesheetService, RestTimesheet } from './timesheet.service';

const requireRestSample: RestTimesheet = {
  ...sampleWithRequiredData,
  periodStartingDate: sampleWithRequiredData.periodStartingDate?.toJSON(),
  periodEndingDate: sampleWithRequiredData.periodEndingDate?.toJSON(),
};

describe('Timesheet Service', () => {
  let service: TimesheetService;
  let httpMock: HttpTestingController;
  let expectedResult: ITimesheet | ITimesheet[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TimesheetService);
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

    it('should create a Timesheet', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const timesheet = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(timesheet).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Timesheet', () => {
      const timesheet = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(timesheet).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Timesheet', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Timesheet', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Timesheet', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTimesheetToCollectionIfMissing', () => {
      it('should add a Timesheet to an empty array', () => {
        const timesheet: ITimesheet = sampleWithRequiredData;
        expectedResult = service.addTimesheetToCollectionIfMissing([], timesheet);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(timesheet);
      });

      it('should not add a Timesheet to an array that contains it', () => {
        const timesheet: ITimesheet = sampleWithRequiredData;
        const timesheetCollection: ITimesheet[] = [
          {
            ...timesheet,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTimesheetToCollectionIfMissing(timesheetCollection, timesheet);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Timesheet to an array that doesn't contain it", () => {
        const timesheet: ITimesheet = sampleWithRequiredData;
        const timesheetCollection: ITimesheet[] = [sampleWithPartialData];
        expectedResult = service.addTimesheetToCollectionIfMissing(timesheetCollection, timesheet);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(timesheet);
      });

      it('should add only unique Timesheet to an array', () => {
        const timesheetArray: ITimesheet[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const timesheetCollection: ITimesheet[] = [sampleWithRequiredData];
        expectedResult = service.addTimesheetToCollectionIfMissing(timesheetCollection, ...timesheetArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const timesheet: ITimesheet = sampleWithRequiredData;
        const timesheet2: ITimesheet = sampleWithPartialData;
        expectedResult = service.addTimesheetToCollectionIfMissing([], timesheet, timesheet2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(timesheet);
        expect(expectedResult).toContain(timesheet2);
      });

      it('should accept null and undefined values', () => {
        const timesheet: ITimesheet = sampleWithRequiredData;
        expectedResult = service.addTimesheetToCollectionIfMissing([], null, timesheet, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(timesheet);
      });

      it('should return initial array if no Timesheet is added', () => {
        const timesheetCollection: ITimesheet[] = [sampleWithRequiredData];
        expectedResult = service.addTimesheetToCollectionIfMissing(timesheetCollection, undefined, null);
        expect(expectedResult).toEqual(timesheetCollection);
      });
    });

    describe('compareTimesheet', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTimesheet(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { timesheetId: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTimesheet(entity1, entity2);
        const compareResult2 = service.compareTimesheet(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { timesheetId: 123 };
        const entity2 = { timesheetId: 456 };

        const compareResult1 = service.compareTimesheet(entity1, entity2);
        const compareResult2 = service.compareTimesheet(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { timesheetId: 123 };
        const entity2 = { timesheetId: 123 };

        const compareResult1 = service.compareTimesheet(entity1, entity2);
        const compareResult2 = service.compareTimesheet(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
