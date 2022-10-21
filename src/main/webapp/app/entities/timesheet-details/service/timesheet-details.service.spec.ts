import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITimesheetDetails } from '../timesheet-details.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../timesheet-details.test-samples';

import { TimesheetDetailsService, RestTimesheetDetails } from './timesheet-details.service';

const requireRestSample: RestTimesheetDetails = {
  ...sampleWithRequiredData,
  workdate: sampleWithRequiredData.workdate?.toJSON(),
};

describe('TimesheetDetails Service', () => {
  let service: TimesheetDetailsService;
  let httpMock: HttpTestingController;
  let expectedResult: ITimesheetDetails | ITimesheetDetails[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TimesheetDetailsService);
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

    it('should create a TimesheetDetails', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const timesheetDetails = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(timesheetDetails).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TimesheetDetails', () => {
      const timesheetDetails = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(timesheetDetails).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TimesheetDetails', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TimesheetDetails', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TimesheetDetails', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTimesheetDetailsToCollectionIfMissing', () => {
      it('should add a TimesheetDetails to an empty array', () => {
        const timesheetDetails: ITimesheetDetails = sampleWithRequiredData;
        expectedResult = service.addTimesheetDetailsToCollectionIfMissing([], timesheetDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(timesheetDetails);
      });

      it('should not add a TimesheetDetails to an array that contains it', () => {
        const timesheetDetails: ITimesheetDetails = sampleWithRequiredData;
        const timesheetDetailsCollection: ITimesheetDetails[] = [
          {
            ...timesheetDetails,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTimesheetDetailsToCollectionIfMissing(timesheetDetailsCollection, timesheetDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TimesheetDetails to an array that doesn't contain it", () => {
        const timesheetDetails: ITimesheetDetails = sampleWithRequiredData;
        const timesheetDetailsCollection: ITimesheetDetails[] = [sampleWithPartialData];
        expectedResult = service.addTimesheetDetailsToCollectionIfMissing(timesheetDetailsCollection, timesheetDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(timesheetDetails);
      });

      it('should add only unique TimesheetDetails to an array', () => {
        const timesheetDetailsArray: ITimesheetDetails[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const timesheetDetailsCollection: ITimesheetDetails[] = [sampleWithRequiredData];
        expectedResult = service.addTimesheetDetailsToCollectionIfMissing(timesheetDetailsCollection, ...timesheetDetailsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const timesheetDetails: ITimesheetDetails = sampleWithRequiredData;
        const timesheetDetails2: ITimesheetDetails = sampleWithPartialData;
        expectedResult = service.addTimesheetDetailsToCollectionIfMissing([], timesheetDetails, timesheetDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(timesheetDetails);
        expect(expectedResult).toContain(timesheetDetails2);
      });

      it('should accept null and undefined values', () => {
        const timesheetDetails: ITimesheetDetails = sampleWithRequiredData;
        expectedResult = service.addTimesheetDetailsToCollectionIfMissing([], null, timesheetDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(timesheetDetails);
      });

      it('should return initial array if no TimesheetDetails is added', () => {
        const timesheetDetailsCollection: ITimesheetDetails[] = [sampleWithRequiredData];
        expectedResult = service.addTimesheetDetailsToCollectionIfMissing(timesheetDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(timesheetDetailsCollection);
      });
    });

    describe('compareTimesheetDetails', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTimesheetDetails(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { timesheetDetailsId: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTimesheetDetails(entity1, entity2);
        const compareResult2 = service.compareTimesheetDetails(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { timesheetDetailsId: 123 };
        const entity2 = { timesheetDetailsId: 456 };

        const compareResult1 = service.compareTimesheetDetails(entity1, entity2);
        const compareResult2 = service.compareTimesheetDetails(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { timesheetDetailsId: 123 };
        const entity2 = { timesheetDetailsId: 123 };

        const compareResult1 = service.compareTimesheetDetails(entity1, entity2);
        const compareResult2 = service.compareTimesheetDetails(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
