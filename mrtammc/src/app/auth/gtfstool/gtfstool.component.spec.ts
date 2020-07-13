import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GtfstoolComponent } from './gtfstool.component';

describe('GtfstoolComponent', () => {
  let component: GtfstoolComponent;
  let fixture: ComponentFixture<GtfstoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GtfstoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtfstoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
