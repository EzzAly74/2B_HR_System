import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Globals } from 'src/app/class/globals';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { SetAssetCoordinatorService } from './set-asset-coordinator.service';
@Component({
    selector: 'app-set-asset-coordinator',
    standalone: true,
    imports: [GlobalsModule, PrimeNgModule],
    providers: [MessageService, DatePipe, TranslateService],
    templateUrl: './set-asset-coordinator.component.html',
    styleUrl: './set-asset-coordinator.component.scss',
})
export class SetAssetCoordinatorComponent {
    constructor(
        private setAssetCoordinatorService: SetAssetCoordinatorService,
        private messageService: MessageService,
        private translate: TranslateService
    ) { }
    dropdownItemsDepartment: any;
    dropdownItemsShift: any;
    dropdownItemsEmployee: any;

    loading: boolean = false;
    selectedDepartment: any;
    selectedShift: any;
    selectedEmployee: any;
    selectedEmployeeIds: any[] = [];

    endPoint: string;

    ngOnInit(): void {
        this.endPoint = 'AssetCoordinator';

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.setAssetCoordinatorService.setCulture(mainLang);

            // update endpoint
            this.setAssetCoordinatorService.setEndPoint(this.endPoint);

            // get all Drop Down Fields
            this.getALlDropDown();
        });
    }

    // ngAfterViewInit() {
    //     // Wait until the view is initialized and then set the selectedEmployeeIds
    //     this.selectedEmployee = this.dropdownItemsEmployee.filter(
    //         (employee: any) => employee.isCoordinator
    //     );
    //     this.selectedEmployee.forEach((employee) => {
    //         this.selectedEmployeeIds.push(employee.employeeId);
    //     });
    // }

    getDropDownField(self: { field: any; enum: string; id?: number }) {
        this.loading = true;
        this.setAssetCoordinatorService.getDropdownField(self.enum).subscribe({
            next: (res) => {
                this.loading = false;
                this[self.field] = res.data;
            },
            error: (err) => {
                this.loading = true;
                console.log(`error in ${self.field}`);
                console.log(err);
            },
        });
    }

    getALlDropDown() {
        // get Department Dropdown
        this.getDropDownField({
            field: 'dropdownItemsDepartment',
            enum: 'CovenantCategory',
        });

        // get Shift Dropdown
        // this.getDropDownField({ field: 'dropdownItemsShift', enum: 'Shift' });
    }

    ChangeEmployees(dept: any) {
        console.log(dept.id);
        this.loading = true;
        this.setAssetCoordinatorService
            .getDropdownField('AssetCoordinator', dept.id)
            .subscribe({
                next: (res) => {
                    this.dropdownItemsEmployee = res.data;

                    this.loading = false;
                    this.selectedEmployeeIds = []; // Ensure the array is initialized

                    this.selectedEmployee = this.dropdownItemsEmployee.filter(
                        (employee: any) => {
                            if (employee.isCoordinator) {
                                this.selectedEmployeeIds.push(
                                    employee.employeeId
                                );
                                return true;
                            }
                            return false;
                        }
                    );

                    console.log(this.selectedEmployee);
                },
                error: (err) => {
                    this.loading = false;
                    console.log(err);
                },
            });
    }

    onSelectEmployees(event: any) {
        this.selectedEmployee = event.value;
        this.selectedEmployeeIds = [];
        event.value.forEach((employee: any) => {
            this.selectedEmployeeIds.push(employee.employeeId);
        });
        console.log('Selected Employees:', this.selectedEmployeeIds);
    }

    registerSubmit() {
        let body = {
            covenantCategoryId: this.selectedDepartment.id,
            employeesIds: this.selectedEmployeeIds,
        };
        console.log(body);

        this.loading = true;
        this.setAssetCoordinatorService.registerRange(body).subscribe({
            next: (res) => {
                console.log(res);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Assets Coordinator Assigned successfully',
                    life: 3000,
                });
                this.loading = false
            },
            error: (err) => {
                console.log(err);
                this.loading = false
            },
        });
    }
}
