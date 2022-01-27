import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMoviePictureComponent } from './show-movie-picture.component';

describe('ShowMoviePictureComponent', () => {
  let component: ShowMoviePictureComponent;
  let fixture: ComponentFixture<ShowMoviePictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowMoviePictureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMoviePictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
