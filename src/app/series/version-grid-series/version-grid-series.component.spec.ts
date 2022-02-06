import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionGridSeriesComponent } from './version-grid-series.component';

describe('VersionGridSeriesComponent', () => {
  let component: VersionGridSeriesComponent;
  let fixture: ComponentFixture<VersionGridSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionGridSeriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionGridSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
