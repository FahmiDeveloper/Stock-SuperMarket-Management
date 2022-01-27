import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionGridMoviesComponent } from './version-grid-movies.component';

describe('VersionGridMoviesComponent', () => {
  let component: VersionGridMoviesComponent;
  let fixture: ComponentFixture<VersionGridMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionGridMoviesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionGridMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
