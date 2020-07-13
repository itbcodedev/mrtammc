import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateSpecComponent } from './validate-spec.component';

describe('ValidateSpecComponent', () => {
  let component: ValidateSpecComponent;
  let fixture: ComponentFixture<ValidateSpecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateSpecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
