import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRDVComponent } from './create-rdv.component';

describe('CreateRDVComponent', () => {
  let component: CreateRDVComponent;
  let fixture: ComponentFixture<CreateRDVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateRDVComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRDVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
