import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEmployeePictureComponent } from './show-employee-picture.component';

describe('ShowEmployeePictureComponent', () => {
  let component: ShowEmployeePictureComponent;
  let fixture: ComponentFixture<ShowEmployeePictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowEmployeePictureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowEmployeePictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
