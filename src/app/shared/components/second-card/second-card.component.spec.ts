import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondCardComponent } from './second-card.component';

describe('SecondCardComponent', () => {
  let component: SecondCardComponent;
  let fixture: ComponentFixture<SecondCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
