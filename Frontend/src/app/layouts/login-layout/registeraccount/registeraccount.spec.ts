import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Registeraccount } from './registeraccount';

describe('Registeraccount', () => {
  let component: Registeraccount;
  let fixture: ComponentFixture<Registeraccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registeraccount],
    }).compileComponents();

    fixture = TestBed.createComponent(Registeraccount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
