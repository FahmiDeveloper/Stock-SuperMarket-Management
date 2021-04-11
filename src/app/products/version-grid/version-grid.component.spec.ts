import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionGridComponent } from './version-grid.component';

describe('VersionGridComponent', () => {
  let component: VersionGridComponent;
  let fixture: ComponentFixture<VersionGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
