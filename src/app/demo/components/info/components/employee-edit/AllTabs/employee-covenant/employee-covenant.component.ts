import { DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Globals } from 'src/app/class/globals';
import { ActivatedRoute } from '@angular/router';
import { EmployeeConvenantService } from './employee-convenant.service';
import { itemsPerPageGlobal } from 'src/main';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-employee-covenant',
    standalone: true,
    imports: [GlobalsModule, PrimeNgModule],
    providers: [MessageService, DatePipe],

    templateUrl: './employee-covenant.component.html',
    styleUrl: './employee-covenant.component.scss',
})
export class EmployeeCovenantComponent {
    constructor(
        private employeeConvenantService: EmployeeConvenantService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private DatePipe: DatePipe
    ) { }

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
    notes!: string;
    showFormNew: boolean = false;
    sortField: string = 'id';
    sortOrder: string = 'asc';
    currentId!: number;
    courseName!: string;
    date!: Date;
    cost!: number;
    hrApproved: boolean = false;
    stockVacation: boolean = false;
    dropdownItemsCovenantType!: any;
    selectedCovenantType!: number;
    selectedCovenant!: any;
    selectedCovenantEdit!: any;

    addNewForm!: FormGroup;
    editForm!: FormGroup;
    departmentDropDown!: any;

    ngOnInit() {
        this.endPoint = 'EmployeeCovenant';
        this.route.parent?.paramMap.subscribe((params) => {
            this.currentId = Number(params.get('id'));
            console.log('currentId:', this.currentId);
        });

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
            { field: 'cost', header: 'cost' },
            { field: 'notes', header: 'Notes' },
            { field: 'serialNumber', header: 'SerialNumber' },

            // Generic Fields
            { field: 'creationTime', header: 'CreationTime' },
            { field: 'lastModificationTime', header: 'LastModificationTime' },
            { field: 'creatorName', header: 'CreatorName' },
            { field: 'lastModifierName', header: 'LastModifierName' },
        ];
        this.getCovenantTypes();

        this.initFormGroups();
    }

    getDropDownDepartment() {
        this.employeeConvenantService.getDropdownField('Department').subscribe({
            next: (res: any) => {
                this.departmentDropDown = res.data;
            },
        });
    }

    initFormGroups() {
        this.addNewForm = new FormGroup({
            covenantCategoryId: new FormControl(null, Validators.required),
            date: new FormControl(null, Validators.required),
            cost: new FormControl(null, Validators.required),
            notes: new FormControl(null),
        })

        this.editForm = new FormGroup({
            covenantCategoryId: new FormControl(null, Validators.required),
            date: new FormControl(null, Validators.required),
            cost: new FormControl(null, Validators.required),
            notes: new FormControl(null),
        })
    }

    editProduct(rowData: any) {
        console.log(rowData.id);
        rowData.date = this.convertDate(rowData.date, 'MM/dd/yyyy');

        this.employeeConvenantService.GetById(rowData.id).subscribe({
            next: (res) => {

                this.product = { ...res.data };

                this.editForm.patchValue({
                    covenantId: this.dropdownItemsCovenantType.find(
                        (item: any) => item.id == this.product.covenantId
                    )
                })

                // alert(JSON.stringify(this.product.covenantId));

                this.product.date = this.convertDate(this.product.date, 'MM/dd/yyyy');
                console.log(this.product.date);


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

    startAttendeesTimeClick(event: any) { }

    endAttendeesTimeClick(event: any) { }

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

    addNew(form: FormGroup) {
        // first convert from date full format to time only
        // why? because prime ng calender component returned the value as a full Date Format

        // set body of request
        let body = {
            ...form.value,
            employeeId: this.currentId,
            date: this.convertDate(form.get('date').value, 'yyyy-MM-ddTHH:mm:ss'),
        };

        console.log(body);

        if (form.valid) {
            // Confirm add new
            this.employeeConvenantService.Register(body).subscribe({
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

                },
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
        this.selectedCovenantType = null;
        this.date = null;
        this.cost = null;
        this.notes = null;
        this.selectedCovenant = null;
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
            employeeId: this.currentId,
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

    saveProduct(product: any, form: FormGroup) {
        this.submitted = true;

        let body = {
            ...form.value,
            employeeId: this.currentId,
            date: this.convertDate(product.date, 'yyyy-MM-ddTHH:mm:ss'),
            id: product.id,
        };
        if (form.valid) {

            this.employeeConvenantService.Edit(body).subscribe({
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
                },
            });
        }

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
    selectCovenant(event: any) {
        console.log(event);
        this.selectedCovenantType = event.value.id;
        this.selectedCovenant = event.value;
    }
    selectedCovenantEditFun(event: any) {
        this.selectedCovenantEdit = event.value;
    }
}
