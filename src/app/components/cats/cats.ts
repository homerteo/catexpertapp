import { Component, inject, OnInit } from '@angular/core';
import { Cat } from '../../services/cat';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cats',
  imports: [CommonModule],
  templateUrl: './cats.html',
  styleUrl: './cats.scss'
})
export class Cats implements OnInit {
  private catsService = inject(Cat);

  breeds = this.catsService.breeds;
  selectedBreed = this.catsService.selectedBreed;
  isLoading = this.catsService.isLoading;
  breedsError = this.catsService.breedsError;
  hasBreeds = this.catsService.hasBreads;
  selectedBreedImage = this.catsService.selectedBreedImage;

  ngOnInit(): void {
    this.catsService.loadBreeds();
  }

  onSelectBreed(event: Event): void {
    const target = event.target as HTMLSelectElement;

    if(target.value && target.value !== 'null') {
      this.catsService.loadSelectedBreed(target.value);
    }
  }
}
