import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITimeoffType } from '../timeoff-type.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../timeoff-type.test-samples';

import { TimeoffTypeService } from './timeoff-type.service';

const requireRestSample: ITimeoffType = {
  ...sampleWithRequiredData,
};

describe('TimeoffType Service', () => {
  let service: TimeoffTypeService;
  let httpMock: HttpTestingController;
  let expectedResult: ITimeoffType | ITimeoffType[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TimeoffTypeService);
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

    it('should create a TimeoffType', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const timeoffType = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(timeoffType).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TimeoffType', () => {
      const timeoffType = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(timeoffType).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TimeoffType', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TimeoffType', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TimeoffType', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTimeoffTypeToCollectionIfMissing', () => {
      it('should add a TimeoffType to an empty array', () => {
        const timeoffType: ITimeoffType = sampleWithRequiredData;
        expectedResult = service.addTimeoffTypeToCollectionIfMissing([], timeoffType);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(timeoffType);
      });

      it('should not add a TimeoffType to an array that contains it', () => {
        const timeoffType: ITimeoffType = sampleWithRequiredData;
        const timeoffTypeCollection: ITimeoffType[] = [
          {
            ...timeoffType,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTimeoffTypeToCollectionIfMissing(timeoffTypeCollection, timeoffType);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TimeoffType to an array that doesn't contain it", () => {
        const timeoffType: ITimeoffType = sampleWithRequiredData;
        const timeoffTypeCollection: ITimeoffType[] = [sampleWithPartialData];
        expectedResult = service.addTimeoffTypeToCollectionIfMissing(timeoffTypeCollection, timeoffType);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(timeoffType);
      });

      it('should add only unique TimeoffType to an array', () => {
        const timeoffTypeArray: ITimeoffType[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const timeoffTypeCollection: ITimeoffType[] = [sampleWithRequiredData];
        expectedResult = service.addTimeoffTypeToCollectionIfMissing(timeoffTypeCollection, ...timeoffTypeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const timeoffType: ITimeoffType = sampleWithRequiredData;
        const timeoffType2: ITimeoffType = sampleWithPartialData;
        expectedResult = service.addTimeoffTypeToCollectionIfMissing([], timeoffType, timeoffType2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(timeoffType);
        expect(expectedResult).toContain(timeoffType2);
      });

      it('should accept null and undefined values', () => {
        const timeoffType: ITimeoffType = sampleWithRequiredData;
        expectedResult = service.addTimeoffTypeToCollectionIfMissing([], null, timeoffType, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(timeoffType);
      });

      it('should return initial array if no TimeoffType is added', () => {
        const timeoffTypeCollection: ITimeoffType[] = [sampleWithRequiredData];
        expectedResult = service.addTimeoffTypeToCollectionIfMissing(timeoffTypeCollection, undefined, null);
        expect(expectedResult).toEqual(timeoffTypeCollection);
      });
    });

    describe('compareTimeoffType', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTimeoffType(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { timeoffTypeId: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTimeoffType(entity1, entity2);
        const compareResult2 = service.compareTimeoffType(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { timeoffTypeId: 123 };
        const entity2 = { timeoffTypeId: 456 };

        const compareResult1 = service.compareTimeoffType(entity1, entity2);
        const compareResult2 = service.compareTimeoffType(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { timeoffTypeId: 123 };
        const entity2 = { timeoffTypeId: 123 };

        const compareResult1 = service.compareTimeoffType(entity1, entity2);
        const compareResult2 = service.compareTimeoffType(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
