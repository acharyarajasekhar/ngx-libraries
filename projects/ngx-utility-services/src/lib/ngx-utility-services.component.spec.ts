import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxUtilityServicesComponent } from './ngx-utility-services.component';

describe('NgxUtilityServicesComponent', () => {
  let component: NgxUtilityServicesComponent;
  let fixture: ComponentFixture<NgxUtilityServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxUtilityServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxUtilityServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
