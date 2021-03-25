import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInFormComponent } from './stock-in-form.component';

describe('StockInFormComponent', () => {
  let component: StockInFormComponent;
  let fixture: ComponentFixture<StockInFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockInFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
