import { DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Globals } from 'src/app/class/globals';
import { AllEmployeeCovenantService } from './all-employee-covenant.service';
import { itemsPerPageGlobal } from 'src/main';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-all-employees-covenant',
    imports: [
        GlobalsModule,
        PrimeNgModule,
    ],
    providers: [MessageService, DatePipe],
    templateUrl: './all-employees-covenant.component.html',
    styleUrl: './all-employees-covenant.component.scss',
})
export class AllEmployeesCovenantComponent {
    constructor(
        private employeeConvenantService: AllEmployeeCovenantService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private DatePipe: DatePipe,
        private fb: FormBuilder
    ) {}

    @ViewChild('dt') dt: Table;
    @Input() endPoint!: string;
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
    nots!: string;
    showFormNew: boolean = false;
    sortField: string = 'id';
    sortOrder: string = 'asc';
    currentId: number;
    courseName!: string;
    date!: Date;
    cost!: number;
    hrApproved: boolean = false;
    stockVacation: boolean = false;
    dropdownItemsCovenantType!: any;

    // for all employees customize
    dropdownItemsEmployee: any;
    selectedEmployee: any;
    selectedEmployeeEdit: any;

    selectedCovenantType!: number;
    selectedCovenant!: any;
    selectedCovenantEdit!: any;

    //edit formGroup
    addNewForm: FormGroup;
    editForm: FormGroup;

    ngOnInit() {
        this.endPoint = 'EmployeeCovenant';

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.employeeConvenantService.setCulture(mainLang);

            // update endpoint
            this.employeeConvenantService.setEndPoint(this.endPoint);

            // then, load data again to lens on the changes of mainLang & endPoints Call
            this.loadData(
                this.page,
                this.itemsPerPage,
                this.nameFilter,
                this.sortField,
                this.sortOrder
            );
        });

        this.cols = [
            // main field
            { field: 'name', header: 'Name' },

            // personal fields

            { field: 'numberOfHours', header: 'NumberOfHours' },

            // main field
            { field: 'notes', header: 'Notes' },

            // Generic Fields
            { field: 'creationTime', header: 'CreationTime' },
            { field: 'lastModificationTime', header: 'LastModificationTime' },
            { field: 'creatorName', header: 'CreatorName' },
            { field: 'lastModifierName', header: 'LastModifierName' },
        ];
        this.getCovenantTypes();
        this.getDropDownEmployee();

        this.defineFormGroups();
    }
    defineFormGroups() {
        this.addNewForm = new FormGroup({
            covenantId: new FormControl('', Validators.required),
            employeeId: new FormControl('', Validators.required),
            date: new FormControl('', Validators.required),
            cost: new FormControl(''),
            nots: new FormControl('', Validators.required)
        });
        this.editForm = new FormGroup({
            covenantId: new FormControl('', Validators.required),
            employeeId: new FormControl('', Validators.required),
            date: new FormControl('', Validators.required),
            cost: new FormControl('', Validators.required),
            nots: new FormControl(''),
            id: new FormControl('', Validators.required)
        });

    }

    editProduct(rowData: any) {
        console.log(rowData.id);
        rowData.date = this.convertDate(rowData.date, 'MM/dd/yyyy');
        this.employeeConvenantService.GetById(rowData.id).subscribe({
            next: (res) => {
                console.log('edit here data');
                console.log(res.data);
                this.selectedCovenantEdit = this.dropdownItemsCovenantType.find(
                    (item: any) => item.id == res.data.covenantId
                );

                this.selectedEmployeeEdit = this.dropdownItemsEmployee.find(
                    (item: any) => item.id == res.data.employeeId
                );

                console.log('selectedCovenantEdit => ');
                console.log(this.selectedCovenantEdit);

                console.log('dropdownItemsEmployee => ');
                console.log(this.dropdownItemsEmployee);

                res.data.date = this.convertDate(res.data.date, 'MM/dd/yyyy');
                console.log(res.data.date);

                this.product = { ...res.data };

                this.editForm.patchValue({
                    covenantId: this.selectedCovenantEdit.id,
                    employeeId: this.selectedEmployeeEdit.id,
                    date: this.convertDate(this.product.date, 'yyyy-MM-ddTHH:mm:ss'),
                    cost: this.product.cost,
                    nots: this.product.nots,
                    id: this.product.id,
                });


                this.productDialog = true;
            },
            error: (err) => {
                console.log(err);
            },
        });
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

    startAttendeesTimeClick(event: any) {}

    endAttendeesTimeClick(event: any) {}

    confirmDelete(id: number) {
        // perform delete from sending request to api
        this.employeeConvenantService.DeleteRange([id]).subscribe({
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
            error: (err) => {
                console.log(err);
            },
        });
    }

    addNew() {
        // first convert from date full format to time only
        // why? because prime ng calender component returned the value as a full Date Format

        // set body of request
        // let body = {
        //     covenantId: this.selectedCovenantType,
        //     employeeId: this.selectedEmployee?.['id'],
        //     date: this.convertDate(this.date, 'yyyy-MM-ddTHH:mm:ss'),
        //     cost: this.cost,
        //     nots: this.nots,
        // };

        // console.log(body);

        this.addNewForm =  this.fb.group({
            covenantId: [this.selectedCovenantType, Validators.required],
            employeeId: [this.selectedEmployee?.['id'], Validators.required],
            date: [this.convertDate(this.date, 'yyyy-MM-ddTHH:mm:ss'), Validators.required],
            cost: [this.cost, Validators.required],
            nots: [this.nots, Validators.required],
        });

        // Confirm add new
        this.employeeConvenantService.Register(this.addNewForm).subscribe({
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
                    this.sortOrder
                );
            },
            error: (err) => {
                this.showFormNew = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err,
                    life: 3000,
                });
            },
        });
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
        this.selectedCovenantType = null;
        this.date = null;
        this.cost = null;
        this.nots = null;
        this.selectedCovenant = null;
        this.selectedEmployee = null;
        this.selectedEmployeeEdit = null;
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

        this.employeeConvenantService.GetPage(filteredData).subscribe({
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
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err,
                    life: 3000,
                });
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

    saveProduct( product: any , form : FormGroup) {
        this.submitted = true;
        // console.log(id);;
        console.log(product);

        // let body = {
        //     covenantId: this.selectedCovenantEdit.id,
        //     employeeId: this.selectedEmployeeEdit.id,
        //     date: this.convertDate(product.date, 'yyyy-MM-ddTHH:mm:ss'),
        //     cost: product.cost,
        //     nots: product.nots,
        //     id: product.id,
        // };

        form.patchValue({
            covenantId: this.selectedCovenantEdit.id,
            employeeId: this.selectedEmployeeEdit.id,
            date: this.convertDate(product.date, 'yyyy-MM-ddTHH:mm:ss'),
            cost: product.cost,
            nots: product.nots,
            id: product.id,
        });


        this.employeeConvenantService.Edit(form.value).subscribe({
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
        link.download = 'data_export_' + new Date().getTime() + '.csv';
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

    confirmDeleteSelected() {
        let selectedIds = [];
        console.log('Selected Items :');

        this.selectedItems.forEach((item: any) => {
            selectedIds.push(item.id);
        });

        this.employeeConvenantService.DeleteRange(selectedIds).subscribe({
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
            error: (err) => {
                this.deleteProductsDialog = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Failure',
                    detail: err.statusText,
                    life: 3000,
                });
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
    convertDate(date: any, format: string) {
        return this.DatePipe.transform(date, format);
    }
    getCovenantTypes() {
        this.employeeConvenantService.getDropdownField('Covenant').subscribe({
            next: (res) => {
                console.log(res);
                this.dropdownItemsCovenantType = res.data;
                console.log(this.dropdownItemsCovenantType);
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    getDropDownEmployee() {
        this.employeeConvenantService.getDropdownField('Employee').subscribe({
            next: (res) => {
                console.log(res);
                this.dropdownItemsEmployee = res.data;
                console.log(this.dropdownItemsEmployee);
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
    selectCovenant(event: any) {
        console.log(event);
        this.selectedCovenantType = event.value.id;
        this.selectedCovenant = event.value;
    }

    selectedCovenantEditFun(event: any) {
        this.selectedCovenantEdit = event.value;
    }
}
