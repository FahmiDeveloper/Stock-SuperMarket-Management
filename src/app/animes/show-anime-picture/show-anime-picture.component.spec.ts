import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAnimePictureComponent } from './show-anime-picture.component';

describe('ShowAnimePictureComponent', () => {
  let component: ShowAnimePictureComponent;
  let fixture: ComponentFixture<ShowAnimePictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAnimePictureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAnimePictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
