import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Createapikeys } from './createapikeys';

describe('Createapikeys', () => {
  let component: Createapikeys;
  let fixture: ComponentFixture<Createapikeys>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createapikeys],
    }).compileComponents();

    fixture = TestBed.createComponent(Createapikeys);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
