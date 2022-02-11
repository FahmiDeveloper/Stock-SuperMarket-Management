import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtsForGridComponent } from './debts-for-grid.component';

describe('DebtsForGridComponent', () => {
  let component: DebtsForGridComponent;
  let fixture: ComponentFixture<DebtsForGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtsForGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtsForGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
