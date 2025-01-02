import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { DayNamePipe } from '../shift-vacation/day-name.pipe';
import { MessageService } from 'primeng/api';
import { AllEmployeeLocationService } from './all-employee-location.service';
import { ActivatedRoute } from '@angular/router';
import { itemsPerPageGlobal } from 'src/main';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-all-employees-location',
    standalone: true,
    imports: [GlobalsModule, PrimeNgModule],
    providers: [MessageService, DatePipe, DayNamePipe],
    templateUrl: './all-employees-location.component.html',
    styleUrl: './all-employees-location.component.scss',
})
export class AllEmployeesLocationComponent {
    constructor(
        private _EmployeeLocationService: AllEmployeeLocationService,
        private messageService: MessageService,
        private route: ActivatedRoute
    ) { }

    @ViewChild('dt') dt: Table;
    id!: number;

    endPoint!: string;
    allData: any;
    page: number = 1;
    itemsPerPage = itemsPerPageGlobal;
    selectedItems: any = [];
    cols: any[] = [];
    totalItems: any;
    loading: boolean = true;
    nameFilter: string = '';
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    submitted: boolean = false;
    productDialog: boolean = false;
    product: any;
    event!: any;
    showFormNew: boolean = false;
    sortField: string = 'id';
    sortOrder: string = 'asc';

    locationDropDown: any;
    // for new
    selectedLocation: string;
    selectedLocationId: number;

    // for edit
    selectedLocationEdit: string;
    selectedLocationEditId: number;

    // custom
    empId: number;

    // for all employees customize
    dropdownItemsEmployee: any;
    selectedEmployee: any;
    selectedEmployeeEdit: any;

    addNewForm!: FormGroup;
    editForm!: FormGroup;

    ngOnInit() {
        this.endPoint = 'EmployeeLocation';

        this._EmployeeLocationService.setEndPoint(this.endPoint);

        this.cols = [
            // custom fields
            { field: 'employeeName', header: 'Employee' },
            { field: 'locationName', header: 'Location' },

            // Generic Fields
            { field: 'creationTime', header: 'creationTime' },
            { field: 'lastModificationTime', header: 'lastModificationTime' },
            { field: 'creatorName', header: 'creatorName' },
            { field: 'lastModifierName', header: 'lastModifierName' },
        ];

        // get dropdown for Employee
        this.getLocation();
        this.getDropDownEmployee();
        this.initFormGroups();
    }

    initFormGroups() {
        this.addNewForm = new FormGroup({
            employeeId: new FormControl(null, Validators.required),
            locationId: new FormControl(null, Validators.required),
        });

        this.editForm = new FormGroup({
            Id: new FormControl(null, Validators.required),
            employeeId: new FormControl(null, Validators.required),
            locationId: new FormControl(null, Validators.required),
        });
    }

    getDropDownEmployee() {
        this._EmployeeLocationService.getDropDown('Employee').subscribe({
            next: (res) => {
                console.log(res);
                this.dropdownItemsEmployee = res.data;
                console.log(this.dropdownItemsEmployee);
            },
        });
    }

    getLocation() {
        this._EmployeeLocationService.getDropDown('Location').subscribe({
            next: (res) => {
                console.log(res.data);
                this.locationDropDown = res.data;
            },
        });
    }

    editProduct(rowData: any) {
        // alert(rowData.id);
        console.log('edit works');
        this.loading = true;
        this._EmployeeLocationService.GetById(rowData.id).subscribe({
            next: (res) => {
                console.log(res.data);

                this.loading = true;
                this.product = { ...res.data };
                this.productDialog = true;

                this.selectedLocationEdit = this.locationDropDown.find(
                    (location: any) => location.id == this.product.locationId
                );

                this.selectedEmployeeEdit = this.dropdownItemsEmployee.find(
                    (item: any) => item.id == this.product.employeeId
                );

                this.editForm.patchValue({
                    Id: this.product.id,
                    locationId: this.selectedLocationEdit?.['id'],
                    employeeId: this.selectedEmployeeEdit?.['id'],
                });

                console.log(this.editForm.value);
            },
        });
    }

    confirmDelete(id: number) {
        let body = [id];
        this.loading = true;
        // perform delete from sending request to api
        this._EmployeeLocationService.DeleteRange(body).subscribe({
            next: () => {
                // close dialog
                this.deleteProductDialog = false;

                // show message for user to show processing of deletion.
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000,
                });

                this.loading = false;


                // load data here
                this.loadData(
                    this.page,
                    this.itemsPerPage,
                    this.nameFilter,
                    this.sortField,
                    this.sortOrder
                );
            },

            error: () => {
                this.loading = false;
            }
        });
    }

    addNew() {
        this.addNewForm.patchValue({
            employeeId: this.selectedEmployee.id,
            locationId: this.selectedLocationId,
        });

        this.loading = true;

        if (this.addNewForm.valid) {
            this._EmployeeLocationService
                .Register(this.addNewForm.value)
                .subscribe({
                    next: (res) => {
                        console.log(res);
                        this.showFormNew = false;
                        // show message for success inserted
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'inserted success',
                            life: 3000,
                        });

                        // set fields is empty
                        this.setFieldsNulls();

                        this.loading = false;

                        // load data again
                        this.loadData(
                            this.page,
                            this.itemsPerPage,
                            this.nameFilter,
                            this.sortField,
                            this.sortOrder
                        );
                    },

                    error: () => {
                        this.loading = false;
                    }
                });
        }
    }

    loadFilteredData() {
        this.loadData(
            1,
            this.itemsPerPage,
            this.nameFilter,
            this.sortField,
            this.sortOrder
        );
    }

    setFieldsNulls() {
        this.selectedLocation = null;
        this.selectedEmployee = null;
        this.selectedEmployeeEdit = null;
    }

    onChangeLocation() {
        this.selectedLocationId = this.selectedLocation?.['id'];
    }

    onChangeLocationEdit() {
        this.selectedLocationEditId = this.selectedLocationEdit?.['id'];
    }

    loadData(
        page: number,
        size: number,
        nameFilter: string,
        filterType: string,
        sortType: string
    ) {
        this.loading = true;
        let filteredData = {
            pageNumber: page,
            pageSize: size,
            filterValue: nameFilter,
            filterType: filterType,
            sortType: sortType,
        };
        filteredData.sortType = this.sortOrder;

        console.log('FilteredData');
        console.log(filteredData);

        this.loading = true;

        this._EmployeeLocationService.GetPage(filteredData).subscribe({
            next: (res) => {
                this.loading = false;

                console.log(res);
                this.allData = res.data;
                console.log(res.data);

                this.totalItems = res.totalItems;
                console.log(this.selectedItems);
            },

            error: () => {
                this.loading = false;
            }
        });
    }

    onPageChange(event: any) {
        let x: string;
        console.log(event);
        this.page = Number(event.first / event.rows) + 1;
        x = event.sortOrder === 1 ? 'asc' : 'dsc';
        this.sortOrder = x;
        this.itemsPerPage = event.rows;
        // console.log(this.sortOrder);

        this.loadData(
            this.page,
            this.itemsPerPage,
            this.nameFilter,
            this.sortField,
            this.sortOrder
        );

        // this.selectedItems = this.allData;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteProduct(product: any) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    saveProduct(empLocation: any) {
        this.submitted = true;

        this.editForm.patchValue({
            Id: empLocation.id,
            locationId: this.selectedLocationEdit?.['id'],
            employeeId: this.selectedEmployeeEdit?.['id'],
        });

        console.clear();

        if (this.editForm.valid) {
            console.log(
                'edited Form here =====================> ',
                this.editForm.value
            );

            this.loading = true;

            this._EmployeeLocationService.Edit(this.editForm.value).subscribe({
                next: () => {
                    this.hideDialog();
                    // show message for user to show processing of deletion.
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'You Edit This Item',
                        life: 3000,
                    });

                    this.loading = false;

                    // load data again
                    this.loadData(
                        this.page,
                        this.itemsPerPage,
                        this.nameFilter,
                        this.sortField,
                        this.sortOrder
                    );
                },

                error: () => {
                    this.loading = false;
                }
            });
        } else {
            console.log(
                'Form Not Valid because body is : ',
                this.editForm.value
            );
        }
    }

    toggleNew() {
        if (this.showFormNew) {
            this.showFormNew = false;
        } else {
            this.showFormNew = true;
            this.setFieldsNulls();
        }
    }

    exportCSV() {
        // Convert data to CSV format
        const csvData = this.convertToCSV(this.selectedItems);

        // Adding UTF-8 BOM
        const bom = '\uFEFF';
        const csvContent = bom + csvData;

        // Create a Blob with UTF-8 encoding
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${this.endPoint}_` + new Date().getTime() + '.csv';
        link.click();
    }

    convertToCSV(data: any[]): string {
        if (!data || !data.length) return '';

        const separator = ',';
        let keys = [];

        this.cols.forEach((row) => {
            keys.push(row.field);
        });
        console.log(keys);

        const csvContent = data.map((row) =>
            keys.map((key) => `"${row[key]}"`).join(separator)
        );

        csvContent.unshift(keys.join(separator)); // Add header row
        return csvContent.join('\r\n'); // Join all rows
    }

    splitCamelCase(str: any) {
        return str
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .replace(/\s+/g, ' ')
            .split(' ')
            .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    confirmDeleteSelected() {
        let selectedIds = [];
        console.log('Selected Items :');

        this.selectedItems.forEach((item: any) => {
            selectedIds.push(item.id);
        });

        this.loading = true;

        this._EmployeeLocationService.DeleteRange(selectedIds).subscribe({
            next: (res) => {
                this.deleteProductsDialog = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'items deleted successfully',
                    life: 3000,
                });
                this.selectedItems = [];
                this.loading = false;

                this.loadData(
                    this.page,
                    this.itemsPerPage,
                    this.nameFilter,
                    this.sortField,
                    this.sortOrder
                );
            },

            error: () => {
                this.loading = false;
            }
        });
    }

    sortById(event: any) {
        this.sortField = 'id';

        if (this.sortOrder === 'asc') {
            this.sortOrder = 'dsc';
        } else if (this.sortOrder === 'dsc') {
            this.sortOrder = 'asc';
        }
    }
    sortByName(event: any) {
        this.sortField = 'name';
    }
}
