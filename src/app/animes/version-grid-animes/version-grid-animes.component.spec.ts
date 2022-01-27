import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionGridAnimesComponent } from './version-grid-animes.component';

describe('VersionGridAnimesComponent', () => {
  let component: VersionGridAnimesComponent;
  let fixture: ComponentFixture<VersionGridAnimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionGridAnimesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionGridAnimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
