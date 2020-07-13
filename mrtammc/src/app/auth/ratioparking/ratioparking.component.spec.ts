import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatioparkingComponent } from './ratioparking.component';

describe('RatioparkingComponent', () => {
  let component: RatioparkingComponent;
  let fixture: ComponentFixture<RatioparkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatioparkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatioparkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
