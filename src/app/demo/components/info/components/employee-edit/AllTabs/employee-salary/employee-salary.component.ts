import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DayNamePipe } from '../../../custom/shift-vacation/day-name.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { EmployeeSalaryService } from './employee-salary.service';

@Component({
    selector: 'app-employee-salary',
    standalone: true,
    imports: [
        CommonModule,
        NgxPaginationModule,
        ToolbarModule,
        TableModule,
        RippleModule,
        FileUploadModule,
        HttpClientModule,
        ButtonModule,
        FormsModule,
        DialogModule,
        ToastModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        ReactiveFormsModule,
        CalendarModule,
        DayNamePipe,
        TranslateModule,
    ],
    providers: [MessageService, DatePipe, DayNamePipe],
    templateUrl: './employee-salary.component.html',
    styleUrl: './employee-salary.component.scss',
})
export class EmployeeSalaryComponent {
    constructor(
        private _EmployeeSalaryService: EmployeeSalaryService,
        private messageService: MessageService,
        private route: ActivatedRoute
    ) {}

    @ViewChild('dt') dt: Table;
    id!: number;

    endPoint!: string;
    allData: any = [];
    page: number = 1;
    itemsPerPage = 3;
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

    // custom
    // => for add new
    empId: number;
    year: number;
    basicSalry: number;
    changing: number;
    badal: number;
    hawafez: number;

    // for edit
    yearEdit: number;
    basicSalryEdit: number;
    changingEdit: number;
    badalEdit: number;
    hawafezEdit: number;

    ngOnInit() {
        this.route.parent?.paramMap.subscribe((params) => {
            this.empId = Number(params.get('id'));
            console.log('empId:', this.empId); // This should print the ID from the parent route
        });

        this.endPoint = 'EmployeeSalary';

        this._EmployeeSalaryService.setEndPoint(this.endPoint);

        this.cols = [
            // custom fields
            { field: 'employeeName', header: 'Employee' },
            { field: 'badal', header: 'Badal' },
            { field: 'basicSalry', header: 'BasicSalry' },
            { field: 'changing', header: 'Changing' },
            { field: 'hawafez', header: 'Hawafez' },
            { field: 'year', header: 'Year' },

            // Generic Fields
            { field: 'creationTime', header: 'CreationTime' },
            { field: 'lastModificationTime', header: 'LastModificationTime' },
            { field: 'creatorName', header: 'CreatorName' },
            { field: 'lastModifierName', header: 'LastModifierName' },
        ];
    }

    editProduct(rowData: any) {
        console.log(rowData.id);
        console.log('edit works');
        this._EmployeeSalaryService.GetById(rowData.id).subscribe({
            next: (res) => {
                console.log(res.data);

                this.product = { ...res.data };
                this.productDialog = true;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    confirmDelete(id: number) {
        let body = [id];

        // perform delete from sending request to api
        this._EmployeeSalaryService.DeleteRange(body).subscribe({
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
                    this.sortOrder,
                    this.empId
                );
            },
            error: (err) => {
                console.log(err);

                this.messageService.add({
                    severity: 'error',
                    summary: 'error field',
                    detail: 'Product Deleted',
                    life: 3000,
                });
            },
        });
    }

    addNew() {
        let body = {
            employeeId: this.empId,
            badal: this.badal,
            basicSalry: this.basicSalry,
            changing: this.changing,
            hawafez: this.hawafez,
            year: this.year,
        };

        this._EmployeeSalaryService.Register(body).subscribe({
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

                // load data again
                this.loadData(
                    this.page,
                    this.itemsPerPage,
                    this.nameFilter,
                    this.sortField,
                    this.sortOrder,
                    this.empId
                );
            },
            error: (err) => {
                // this.showFormNew = false;

                this.messageService.add({
                    severity: 'error',
                    summary: 'error field',
                    detail: 'All Fields is required',
                    life: 3000,
                });

                console.log(err);
            },
        });
    }

    loadFilteredData() {
        this.loadData(
            this.page,
            this.itemsPerPage,
            this.nameFilter,
            this.sortField,
            this.sortOrder,
            this.empId
        );
    }

    setFieldsNulls() {}

    loadData(
        page: number,
        size: number,
        nameFilter: string,
        filterType: string,
        sortType: string,
        employeeId: number
    ) {
        this.loading = true;
        let filteredData = {
            pageNumber: page,
            pageSize: size,
            filterValue: nameFilter,
            filterType: filterType,
            sortType: sortType,
            employeeId: employeeId,
        };
        filteredData.sortType = this.sortOrder;

        console.log('FilteredData');
        console.log(filteredData);

        this._EmployeeSalaryService.GetPage(filteredData).subscribe({
            next: (res) => {
                console.log(res);
                this.allData = res.data;
                console.log(res.data);

                this.totalItems = res.totalItems;
                this.loading = false;
                console.log(this.selectedItems);
            },
            error: (err) => {
                console.log(err);
                this.loading = false;
            },
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
            this.sortOrder,
            this.empId
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

    saveProduct(id: number, empSalary: any) {
        this.submitted = true;

        let body = {
            id: empSalary.id,
            employeeId: this.empId,
            badal: empSalary.badal,
            basicSalry: empSalary.basicSalry,
            changing: empSalary.changing,
            hawafez: empSalary.hawafez,
            year: empSalary.year,
        };

        console.clear();
        console.log('body here for editing..........');

        console.log(body);

        this._EmployeeSalaryService.Edit(body).subscribe({
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
                    this.sortOrder,
                    this.empId
                );
            },
            error: (err) => {
                console.log(err);
                alert(err);
            },
        });
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

        this._EmployeeSalaryService.DeleteRange(selectedIds).subscribe({
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
                    this.sortOrder,
                    this.empId
                );
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Failure',
                    detail: err.statusText,
                    life: 3000,
                });
                this.deleteProductsDialog = false;
                this.loadData(
                    this.page,
                    this.itemsPerPage,
                    this.nameFilter,
                    this.sortField,
                    this.sortOrder,
                    this.empId
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
