import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { DayNamePipe } from '../../../custom/shift-vacation/day-name.pipe';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { EmployeeUniformService } from './employee-uniform.service';
import { itemsPerPageGlobal } from 'src/main';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';

@Component({
    selector: 'app-employee-uniform',
    standalone: true,
    imports: [
        GlobalsModule,
        PrimeNgModule,
    ],
    providers: [MessageService, DatePipe, DayNamePipe],
    templateUrl: './employee-uniform.component.html',
    styleUrl: './employee-uniform.component.scss',
})
export class EmployeeUniformComponent {
    constructor(
        private _EmployeeUniformService: EmployeeUniformService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private DatePipe: DatePipe
    ) {}

    @ViewChild('dt') dt: Table;
    id!: number;

    endPoint!: string;
    allData: any = [];
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

    // custom
    uniformCodesDropDown: any;
    empId: number;

    // => for add new
    selectedUnifromCode: any;
    selectedDate: any;
    selectedCost: any;
    selectedNotes: any;

    // for edit
    selectedUnifromCodeEdit: any;
    selectedDateEdit: any;

    ngOnInit() {
        this.route.parent?.paramMap.subscribe((params) => {
            this.empId = Number(params.get('id'));
            console.log('empId:', this.empId); // This should print the ID from the parent route
        });

        this.endPoint = 'EmployeeUniform';

        this._EmployeeUniformService.setEndPoint(this.endPoint);

        this.cols = [
            // custom fields
            { field: 'employeeName', header: 'Employee' },
            { field: 'uniformCodeName', header: 'UniformCodeName' },
            { field: 'date', header: 'Date' },
            { field: 'cost', header: 'Cost' },
            { field: 'notes', header: 'notes' },

            // Generic Fields
            { field: 'creationTime', header: 'CreationTime' },
            { field: 'lastModificationTime', header: 'LastModificationTime' },
            { field: 'creatorName', header: 'CreatorName' },
            { field: 'lastModifierName', header: 'LastModifierName' },
        ];

        // get Drop Down of Unifrom Codes
        this.getDropDown();
    }

    getDropDown() {
        this._EmployeeUniformService.getDropDown('UniformCodes').subscribe({
            next: (res) => {
                this.uniformCodesDropDown = res.data;
                console.log('Drop Down Unifrom Codes from here');
                console.log(res.data);
            },
            error: (err) => {
                console.log('Error in Unifrom Codes DropDown');
                console.error(err);
            },
        });
    }

    editProduct(rowData: any) {
        console.log(rowData.id);
        console.log('edit works');
        this._EmployeeUniformService.GetById(rowData.id).subscribe({
            next: (res) => {
                console.log(res.data);
                this.product = { ...res.data };
                this.productDialog = true;

                // get product.date
                this.selectedDate = this.DatePipe.transform(
                    this.product.date,
                    'MM/dd/yyyy'
                );
                this.product.date = this.DatePipe.transform(
                    this.product.date,
                    'MM/dd/yyyy'
                );

                this.selectedUnifromCodeEdit = this.uniformCodesDropDown.find(
                    (code: any) => code.id == this.product.uniformCodeId
                );
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    confirmDelete(id: number) {
        let body = [id];

        // perform delete from sending request to api
        this._EmployeeUniformService.DeleteRange(body).subscribe({
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

      
            },
        });
    }

    addNew() {
        // convert selected Date
        this.selectedDate = this.DatePipe.transform(
            this.selectedDate,
            'yyyy-MM-dd'
        );

        let body = {
            employeeId: this.empId,
            uniformCodeId: this.selectedUnifromCode?.['id'],
            date: this.selectedDate,
            cost: this.selectedCost,
            nots: this.selectedNotes,
        };

        this._EmployeeUniformService.Register(body).subscribe({
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

        this._EmployeeUniformService.GetPage(filteredData).subscribe({
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

    saveProduct(id: number, empUniform: any) {
        this.submitted = true;

        this.selectedDateEdit = this.DatePipe.transform(
            this.product.date,
            'yyyy-MM-ddTHH:mm:ss'
        );
        this.product.date = this.DatePipe.transform(
            this.product.date,
            'yyyy-MM-ddTHH:mm:ss'
        );

        let body = {
            id: empUniform.id,
            employeeId: this.empId,
            uniformCodeId: this.selectedUnifromCodeEdit.id,
            date: this.product.date,
            cost: this.product.cost,
            nots: this.product.nots,
        };

        console.clear();
        console.log('body here for editing..........');

        console.log(body);

        this._EmployeeUniformService.Edit(body).subscribe({
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

        this._EmployeeUniformService.DeleteRange(selectedIds).subscribe({
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
