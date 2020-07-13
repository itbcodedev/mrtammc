import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GtfsspecComponent } from './gtfsspec.component';

describe('GtfsspecComponent', () => {
  let component: GtfsspecComponent;
  let fixture: ComponentFixture<GtfsspecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GtfsspecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtfsspecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
