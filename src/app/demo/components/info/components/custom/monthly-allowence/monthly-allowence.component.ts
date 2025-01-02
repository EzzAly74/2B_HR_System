import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { DayNamePipe } from '../shift-vacation/day-name.pipe';
import { Table } from 'primeng/table';
import { itemsPerPageGlobal } from 'src/main';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MonthlyAllowenceService } from './monthly-allowence.service';

@Component({
    selector: 'app-monthly-allowence',
    standalone: true,
    imports: [
        GlobalsModule,
        PrimeNgModule,
    ],
    providers: [MessageService, DatePipe, DayNamePipe],
    templateUrl: './monthly-allowence.component.html',
    styleUrl: './monthly-allowence.component.scss'
})
export class MonthlyAllowenceComponent {

    constructor(
        private _MonthlyAllowenceService: MonthlyAllowenceService,
        private messageService: MessageService,
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

    // allowence dropdown
    allowanceDropDown: any;

    // custom
    empId: number;

    // for all employees customize
    dropdownItemsEmployee: any;
    selectedEmployee: any;
    selectedEmployeeEdit: any;

    selectedAllowance: any;
    selectedAllowanceEdit: any;

    addNewForm!: FormGroup;
    editForm!: FormGroup;

    ngOnInit() {
        this.endPoint = 'AllowanceValues';

        this._MonthlyAllowenceService.setEndPoint(this.endPoint);

        this.cols = [
            // custom fields
            { field: 'employeeName', header: 'Employee' },
            { field: 'allowanceName', header: 'Allowance' },
            { field: 'year', header: 'Year' },
            { field: 'month', header: 'Month' },
            { field: 'value', header: 'Value' },

            // Generic Fields
            { field: 'creationTime', header: 'creationTime' },
            { field: 'lastModificationTime', header: 'lastModificationTime' },
            { field: 'creatorName', header: 'creatorName' },
            { field: 'lastModifierName', header: 'lastModifierName' },
        ];

        // get dropdown for Employee
        this.getDropDownEmployee();
        this.getDropDownAllowance()
        this.initFormGroups()
    }

    initFormGroups() {
        this.addNewForm = new FormGroup({
            employeeId: new FormControl(null, Validators.required),
            allowanceId: new FormControl(null, Validators.required),
            year: new FormControl(null, Validators.required),
            month: new FormControl(null, Validators.required),
            value: new FormControl(null, Validators.required),
        })

        this.editForm = new FormGroup({
            id: new FormControl(null, Validators.required),
            employeeId: new FormControl(null, Validators.required),
            allowanceId: new FormControl(null, Validators.required),
            year: new FormControl(null, Validators.required),
            month: new FormControl(null, Validators.required),
            value: new FormControl(null, Validators.required),
        })
    }

    getDropDownEmployee() {
        this._MonthlyAllowenceService.getDropDown('Employee').subscribe({
            next: (res) => {
                console.log(res);
                this.dropdownItemsEmployee = res.data;
                console.log(this.dropdownItemsEmployee);
            },

        });
    }

    getDropDownAllowance() {
        this._MonthlyAllowenceService.getDropDown('Allowance').subscribe({
            next: (res) => {
                console.log(res);
                this.allowanceDropDown = res.data;
                console.log(this.allowanceDropDown);
            },

        });
    }

    editProduct(rowData: any) {
        // alert(rowData.id);
        console.log('edit works');
        this._MonthlyAllowenceService.GetById(rowData.id).subscribe({
            next: (res) => {
                console.log(res.data);

                this.product = { ...res.data };
                this.productDialog = true;


                this.selectedEmployeeEdit = this.dropdownItemsEmployee.find(
                    (item: any) => item.id == this.product.employeeId
                );

                this.selectedAllowanceEdit = this.allowanceDropDown.find(
                    (item: any) => item.id == this.product.allowanceId
                );

                this.editForm.patchValue({
                    id: this.product.id
                })


            },

        });
    }

    confirmDelete(id: number) {

        // perform delete from sending request to api
        this._MonthlyAllowenceService.DeleteSoftById(id).subscribe({
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
            employeeId: this.selectedEmployee?.id,
            allowanceId: this.selectedAllowance?.id,
            month: Number(this.addNewForm.get('month').value),
            year: Number(this.addNewForm.get('year').value),
            value: Number(this.addNewForm.get('value').value),
        })

        if (this.addNewForm.valid) {
            this._MonthlyAllowenceService.Register(this.addNewForm.value).subscribe({
                next: (res) => {
                    console.log(res);
                    this.showFormNew = false;
                    if (res.success) {
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
                    }
                },

            });
        }


    }

    loadFilteredData() {
        this.loadData(
            this.page,
            this.itemsPerPage,
            this.nameFilter,
            this.sortField,
            this.sortOrder
        );
    }

    setFieldsNulls() {
        this.selectedEmployee = null;
        this.selectedEmployeeEdit = null;
        this.selectedAllowance = null;
        this.selectedAllowanceEdit = null;

        this.addNewForm.patchValue({
            year: null,
            month: null,
            value: null
        })
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

        this._MonthlyAllowenceService.GetPage(filteredData).subscribe({
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

    saveProduct() {
        this.submitted = true;

        if (this.editForm.valid) {
            console.log("edited Form here =====================> ",
                this.editForm.value
            );


            this.editForm.patchValue({
                employeeId: this.selectedEmployeeEdit?.id,
                allowanceId: this.selectedAllowanceEdit?.id,
                month: Number(this.editForm.get('month').value),
                year: Number(this.editForm.get('year').value),
                value: Number(this.editForm.get('value').value),
            })

            this._MonthlyAllowenceService.Edit(this.editForm.value).subscribe({
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
        } else {
            console.log('Form Not Valid because body is : ', this.editForm.value);
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

        this._MonthlyAllowenceService.DeleteRange(selectedIds).subscribe({
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
