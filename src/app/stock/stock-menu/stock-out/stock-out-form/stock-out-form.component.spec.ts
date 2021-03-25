import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockOutFormComponent } from './stock-out-form.component';

describe('StockOutFormComponent', () => {
  let component: StockOutFormComponent;
  let fixture: ComponentFixture<StockOutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockOutFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
