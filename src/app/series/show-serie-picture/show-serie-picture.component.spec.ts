import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSeriePictureComponent } from './show-serie-picture.component';

describe('ShowSeriePictureComponent', () => {
  let component: ShowSeriePictureComponent;
  let fixture: ComponentFixture<ShowSeriePictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowSeriePictureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSeriePictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
