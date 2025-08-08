import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatsFilter } from './cats-filter';

describe('CatsFilter', () => {
  let component: CatsFilter;
  let fixture: ComponentFixture<CatsFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatsFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatsFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
