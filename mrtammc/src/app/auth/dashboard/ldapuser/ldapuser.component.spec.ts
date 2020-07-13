import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdapuserComponent } from './ldapuser.component';

describe('LdapuserComponent', () => {
  let component: LdapuserComponent;
  let fixture: ComponentFixture<LdapuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdapuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdapuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
