import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployeeVacationStockComponent } from './all-employee-vacation-stock.component';

describe('AllEmployeeVacationStockComponent', () => {
  let component: AllEmployeeVacationStockComponent;
  let fixture: ComponentFixture<AllEmployeeVacationStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllEmployeeVacationStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllEmployeeVacationStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
