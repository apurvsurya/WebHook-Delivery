import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardDetails } from './dashboard-details';

describe('DashboardDetails', () => {
  let component: DashboardDetails;
  let fixture: ComponentFixture<DashboardDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
