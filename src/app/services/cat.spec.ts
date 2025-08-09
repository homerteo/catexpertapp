import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { Cat } from './cat';
import { Environment } from './environment';
import { Breed, BreedImage } from '../interfaces/breed.interface';

class MockEnvironment {
  apiUrl = 'https://api.thecatapi.com/v1/';
  apiKey = 'test-api-key';
}

const mockBreeds: Breed[] = [
  {
    weight: {
      imperial: '7 - 10',
      metric: '3 - 5'
    },
    id: 'abys',
    name: 'Abyssinian',
    description: 'The Abyssinian is easy to care for',
    origin: 'Egypt',
    life_span: '14 - 15',
    temperament: 'Active, Energetic, Independent',
    reference_image_id: 'img123',
    wikipedia_url: 'https://en.wikipedia.org/wiki/Abyssinian_cat',
    country_codes: 'EG',
    country_code: 'EG',
    indoor: 0,
    alt_names: '',
    adaptability: 5,
    affection_level: 5,
    child_friendly: 3,
    dog_friendly: 4,
    energy_level: 5,
    experimental: 0,
    grooming: 1,
    hairless: 0,
    health_issues: 2,
    hypoallergenic: 0,
    intelligence: 5,
    lap: 1,
    natural: 1,
    rare: 0,
    rex: 0,
    shedding_level: 2,
    short_legs: 0,
    social_needs: 5,
    stranger_friendly: 5,
    suppressed_tail: 0,
    vocalisation: 1,
  },
  {
    weight: {
      imperial: '12 - 22',
      metric: '5 - 10'
    },
    id: 'beng',
    name: 'Bengal',
    description: 'Bengals are a lot of fun to live with',
    origin: 'United States',
    life_span: '12 - 16',
    temperament: 'Alert, Agile, Energetic',
    reference_image_id: 'img456',
    wikipedia_url: 'https://en.wikipedia.org/wiki/Bengal_cat',
    country_codes: 'US',
    country_code: 'US',
    indoor: 0,
    alt_names: '',
    adaptability: 5,
    affection_level: 5,
    child_friendly: 4,
    dog_friendly: 5,
    energy_level: 5,
    experimental: 0,
    grooming: 1,
    hairless: 0,
    health_issues: 3,
    hypoallergenic: 1,
    intelligence: 5,
    lap: 1,
    natural: 0,
    rare: 0,
    rex: 0,
    shedding_level: 3,
    short_legs: 0,
    social_needs: 5,
    stranger_friendly: 5,
    suppressed_tail: 0,
    vocalisation: 4,
  }
];

const mockBreedImage: BreedImage = {
  id: 'img123',
  url: 'https://cdn2.thecatapi.com/images/img123.jpg',
  width: 500,
  height: 400,
  breeds: [mockBreeds[0]]
};

describe('Cat Service', () => {
  let service: Cat;
  let httpMock: HttpTestingController;
  let mockEnvironment: MockEnvironment;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        Cat,
        { provide: Environment, useClass: MockEnvironment }
      ]
    });

    service = TestBed.inject(Cat);
    httpMock = TestBed.inject(HttpTestingController);
    mockEnvironment = TestBed.inject(Environment) as MockEnvironment;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('getBreeds', () => {
    it('should obtener breeeds', () => {
      service.getBreeds(10, 0).subscribe(breeds => {
        expect(breeds).toEqual(mockBreeds);
        expect(service.isLoading()).toBeFalse();
        expect(service.breedsError()).toBeNull();
      });

      expect(service.isLoading()).toBeTrue();

      const req = httpMock.expectOne(`${mockEnvironment.apiUrl}breeds?limit=10&page=0`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBreeds);
    });
  });

  describe('loadBreeds', () => {
    it('Debería cargar razas y cargar la señal', () => {
      service.loadBreeds(15, 1);

      const req = httpMock.expectOne(`${mockEnvironment.apiUrl}breeds?limit=15&page=1`);
      req.flush(mockBreeds);

      expect(service.breeds()).toEqual(mockBreeds);
      expect(service.hasBreads()).toBeTrue();
    });
  });

  describe('getBreedById', () => {
    it('should get breed by id successfully', () => {
      const breedId = 'abys';

      service.getBreedById(breedId).subscribe(breed => {
        expect(breed).toEqual(mockBreeds[0]);
        expect(service.isLoading()).toBeFalse();
        expect(service.breedsError()).toBeNull();
      });

      expect(service.isLoading()).toBeTrue();

      const req = httpMock.expectOne(`${mockEnvironment.apiUrl}breeds/${breedId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBreeds[0]);
    });

    it('should handle error when getting breed by id', () => {
      const breedId = 'invalid-id';

      service.getBreedById(breedId).subscribe(breed => {
        expect(breed).toBeNull();
        expect(service.isLoading()).toBeFalse();
        expect(service.breedsError()).toBe('Error cargando la raza');
      });

      const req = httpMock.expectOne(`${mockEnvironment.apiUrl}breeds/${breedId}`);
      req.error(new ErrorEvent('Not found'));
    });
  });

  describe('getImageBreedById', () => {
    it('should get breed image by id successfully', () => {
      const imageId = 'img123';

      service.getImageBreedById(imageId).subscribe(image => {
        expect(image).toEqual(mockBreedImage);
        expect(service.isLoading()).toBeFalse();
        expect(service.breedsError()).toBeNull();
      });

      expect(service.isLoading()).toBeTrue();

      const req = httpMock.expectOne(`${mockEnvironment.apiUrl}images/${imageId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBreedImage);
    });

    it('should handle error when getting breed image', () => {
      const imageId = 'invalid-image-id';

      service.getImageBreedById(imageId).subscribe(image => {
        expect(image).toBeNull();
        expect(service.isLoading()).toBeFalse();
        expect(service.breedsError()).toBe('Error cargando la imagen');
      });

      const req = httpMock.expectOne(`${mockEnvironment.apiUrl}images/${imageId}`);
      req.error(new ErrorEvent('Image not found'));
    });
  });

  describe('loadSelectedBreed', () => {
    beforeEach(() => {
      service.loadBreeds();
      const req = httpMock.expectOne(`${mockEnvironment.apiUrl}breeds?limit=10&page=0`);
      req.flush(mockBreeds);
    });

    it('Debería cargar la raza y su imagen', () => {
      const breedId = 'abys';

      service.loadSelectedBreed(breedId);
      expect(service.selectedBreed()).toEqual(mockBreeds[0]);

      const req = httpMock.expectOne(`${mockEnvironment.apiUrl}images/img123`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBreedImage);

      expect(service.selectedBreedImage()).toEqual(mockBreedImage);
    });
  })
});
