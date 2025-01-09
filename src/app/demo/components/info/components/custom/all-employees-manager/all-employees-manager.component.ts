import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { DayNamePipe } from '../shift-vacation/day-name.pipe';
import { MessageService } from 'primeng/api';
import { AllEmployeeManagerService } from './all-employee-manager.service';
import { ActivatedRoute } from '@angular/router';
import { itemsPerPageGlobal } from 'src/main';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-all-employees-manager',
    standalone: true,
    imports: [GlobalsModule, PrimeNgModule],
    providers: [MessageService, DatePipe, DayNamePipe],
    templateUrl: './all-employees-manager.component.html',
    styleUrl: './all-employees-manager.component.scss',
})
export class AllEmployeesManagerComponent {
    constructor(
        private _EmployeeManagerService: AllEmployeeManagerService,
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
    loading: boolean = false;
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

    managerDropDown: any;
    // for new
    selectedManager: string;
    selectedManagerId: number;

    // for edit
    selectedManagerEdit: string;
    selectedManagerEditId: number;

    // custom
    empId: number;

    // for all employees customize
    dropdownItemsEmployee: any;
    selectedEmployee: any;
    selectedEmployeeEdit: any;

    addNewForm!: FormGroup;
    editForm!: FormGroup;

    ngOnInit() {
        this.endPoint = 'EmployeeManager';

        this._EmployeeManagerService.setEndPoint(this.endPoint);

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

    getLocation() {
        this._EmployeeManagerService.getDropDownManager('Employee').subscribe({
            next: (res) => {
                console.log(res['data']);
                this.managerDropDown = res['data'];
            },
        });
    }

    getDropDownEmployee() {
        this._EmployeeManagerService.getDropDown('Employee').subscribe({
            next: (res: any) => {
                console.log(res);
                this.dropdownItemsEmployee = res.data;
                console.log(this.dropdownItemsEmployee);
            },
        });
    }

    initFormGroups() {
        this.addNewForm = new FormGroup({
            employeeId: new FormControl(null, Validators.required),
            mangerId: new FormControl(null, Validators.required),
        });

        this.editForm = new FormGroup({
            id: new FormControl(null, Validators.required),
            employeeId: new FormControl(null, Validators.required),
            mangerId: new FormControl(null, Validators.required),
        });
    }

    editProduct(rowData: any) {
        this._EmployeeManagerService.GetById(rowData.id).subscribe({
            next: (res) => {
                console.log(res.data);

                this.product = { ...res.data };
                this.productDialog = true;

                this.selectedManagerEdit = this.managerDropDown.find(
                    (manger: any) => manger.id == this.product.mangerId
                );

                this.selectedEmployeeEdit = this.dropdownItemsEmployee.find(
                    (emp: any) => emp.id == this.product.employeeId
                );

                this.editForm.patchValue({
                    id: this.product.id,
                    mangerId: this.selectedManagerEdit?.['id'],
                    employeeId: this.selectedEmployeeEdit?.['id'],
                });
            },
        });
    }

    confirmDelete(id: number) {
        let body = [id];

        // perform delete from sending request to api
        this._EmployeeManagerService.DeleteRange(body).subscribe({
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

                // load data here
                this.loadData(
                    this.page,
                    this.itemsPerPage,
                    this.nameFilter,
                    this.sortField,
                    this.sortOrder
                );
            },
        });
    }

    addNew() {
        this.addNewForm.patchValue({
            employeeId: this.selectedEmployee?.['id'],
            mangerId: this.selectedManager?.['id'],
        });

        this.loading = true;

        if (this.addNewForm.valid) {
            this._EmployeeManagerService
                .Register(this.addNewForm.value)
                .subscribe({
                    next: (res) => {
                        console.log(res);
                        this.loading = false;

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
        this.selectedManager = null;
    }

    loadData(
        page: number,
        size: number,
        nameFilter: string,
        filterType: string,
        sortType: string
    ) {
        // this.loading = true;
        let filteredData = {
            pageNumber: page,
            pageSize: size,
            filterValue: nameFilter,
            filterType: filterType,
            sortType: sortType,
        };
        filteredData.sortType = this.sortOrder;

        console.log('FilteredData');
        this.loading = true
        console.log(filteredData);

        this._EmployeeManagerService.GetPage(filteredData).subscribe({
            next: (res) => {
                console.log(res);
                this.allData = res.data;
                console.log(res.data);

                this.totalItems = res.totalItems;
                this.loading = false;
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

    saveProduct(empManager: any) {
        this.submitted = true;

        this.editForm.patchValue({
            id: empManager.id,
            mangerId: this.selectedManagerEdit?.['id'],
            employeeId: this.selectedEmployeeEdit?.['id'],
        });

        if (this.editForm.valid) {
            this._EmployeeManagerService.Edit(this.editForm.value).subscribe({
                next: () => {
                    this.hideDialog();
                    // show message for user to show processing of deletion.
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'You Edit This Item',
                        life: 3000,
                    });

                    // load data again
                    this.loadData(
                        this.page,
                        this.itemsPerPage,
                        this.nameFilter,
                        this.sortField,
                        this.sortOrder
                    );
                },
            });
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

        this._EmployeeManagerService.DeleteRange(selectedIds).subscribe({
            next: (res) => {
                this.deleteProductsDialog = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'items deleted successfully',
                    life: 3000,
                });
                this.selectedItems = [];

                this.loadData(
                    this.page,
                    this.itemsPerPage,
                    this.nameFilter,
                    this.sortField,
                    this.sortOrder
                );
            },
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
