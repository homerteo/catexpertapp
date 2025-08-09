import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, Observable, of, pipe } from 'rxjs';
import { Environment } from './environment';
import { Breed, BreedImage } from '../interfaces/breed.interface';

@Injectable({
  providedIn: 'root'
})
export class Cat {
  private http = inject(HttpClient);
  private envService = inject(Environment);

  // Estados privados
  private _breeds = signal<Breed[]>([]);
  private _selectedBreed = signal<Breed | null>(null);
  private _selectedBreedImage = signal<BreedImage | null>(null);

  // loadings
  private _isLoading = signal(false);

  // errores
  private _breedsError = signal<string | null>(null);

  // Estados públicos
  readonly breeds = this._breeds.asReadonly();
  readonly selectedBreed = this._selectedBreed.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly breedsError = this._breedsError.asReadonly();
  readonly selectedBreedImage = this._selectedBreedImage.asReadonly();

  // Estados computados
  readonly hasBreads = computed(() => this.breeds().length > 0);
  readonly selectedImage = computed(() => this.selectedBreedImage()?.url);

  getBreeds(limit: number = 10, page: number = 0): Observable<Breed[]> {
    this._isLoading.set(true);
    this._breedsError.set(null);
    const url = `${this.envService.apiUrl}breeds?limit=${limit}&page=${page}`;

    return this.http.get<Breed[]>(url).pipe(
      catchError((error) => {
        this._breedsError.set('Error cargando la lista de razas');
        return of([]);
      }),
      finalize(() => {
        this._isLoading.set(false);
      })
    );
  }

  loadBreeds(limit: number = 10, page: number = 0): void {
    this.getBreeds(limit, page).subscribe(breeds => {
      this._breeds.set(breeds);
    });
  }

  getBreedById(idBreed: string): Observable<Breed | null> {
    this._isLoading.set(true);
    this._breedsError.set(null);

    const url = `${this.envService.apiUrl}breeds/${idBreed}`;

    return this.http.get<Breed>(url).pipe(
      catchError((error) => {
        this._breedsError.set('Error cargando la raza');
        return of(null)
      }),
      finalize(() => {
        this._isLoading.set(false);
      })
    )
  }

  getImageBreedById(imageId: string): Observable<BreedImage | null> {
    this._isLoading.set(true);
    this._breedsError.set(null);

    const url = `${this.envService.apiUrl}images/${imageId}`;

    return this.http.get<BreedImage>(url).pipe(
      catchError((error) => {
        this._breedsError.set('Error cargando la imagen');
        return of(null)
      }),
      finalize(() => {
        this._isLoading.set(false);
      })
    )
  }

  loadSelectedBreed(breedId: string): void {
    const breed = this._breeds().find(b => b.id === breedId);
    if(breed) {
      this._selectedBreed.set(breed);
    }

    this.getImageBreedById(breed?.reference_image_id!).subscribe(image => {
      this._selectedBreedImage.set(image)
    })
  }
}
