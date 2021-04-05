import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProductPictureComponent } from './show-product-picture.component';

describe('ShowProductPictureComponent', () => {
  let component: ShowProductPictureComponent;
  let fixture: ComponentFixture<ShowProductPictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowProductPictureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowProductPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
