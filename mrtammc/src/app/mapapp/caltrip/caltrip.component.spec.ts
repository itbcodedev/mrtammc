import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaltripComponent } from './caltrip.component';

describe('CaltripComponent', () => {
  let component: CaltripComponent;
  let fixture: ComponentFixture<CaltripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaltripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaltripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
