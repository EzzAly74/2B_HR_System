import { CloseMonthService } from './close-month.service';

import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';

import { Table } from 'primeng/table';

import { Globals } from 'src/app/class/globals';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { itemsPerPageGlobal } from 'src/main';

@Component({
    selector: 'app-close-month',
    standalone: true,
    imports: [GlobalsModule, PrimeNgModule],
    providers: [MessageService],
    templateUrl: './close-month.component.html',
    styleUrl: './close-month.component.scss',
})
export class CloseMonthComponent {
    constructor(
        private closeMonthService: CloseMonthService,
        private messageService: MessageService,
        private translate: TranslateService
    ) { }

    @ViewChild('dt') dt: Table;
    @Input() endPoint!: string;
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
    newNotes!: string;
    showFormNew: boolean = false;
    sortField: string = 'id';
    sortOrder: string = 'asc';
    allMonths: any = [];
    month!: number;
    year!: number;
    closed: boolean = false;
    selectedMonth: number;
    selectedMonthEdit: any;
    allYears: number[] = [];
    selectedYear: number;
    selectedYearEdit: number;
    items: any = [];

    addNewForm: FormGroup = new FormGroup({
        month: new FormControl(null, [Validators.required]),
        year: new FormControl(null, [Validators.required]),
        closed: new FormControl(false, [Validators.required]),
    });

    editForm: FormGroup = new FormGroup({
        month: new FormControl(null, [Validators.required]),
        year: new FormControl(null, [Validators.required]),
        closed: new FormControl(false, [Validators.required]),
        id: new FormControl(null, [Validators.required]),
    });



    updateTranslations() {
        this.items = [
            {
                icon: 'pi pi-home',
                route: '/', label: this.translate.instant("breadcrumb.gen.home"), start: true
            },
            {
                label: this.translate.instant('breadcrumb.cats.payrollManagement.title'),
                iconPath: ''
            },
            {
                label: this.translate.instant(`breadcrumb.cats.payrollManagement.items.${this.endPoint}`),
            }];
    }

    ngOnInit() {
        this.endPoint = 'CloseMonth';

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.closeMonthService.setCulture(mainLang);

            // update endpoint
            this.closeMonthService.setEndPoint(this.endPoint);

            // then, load data again to lens on the changes of mainLang & endPoints Call
            this.loadData(
                this.page,
                this.itemsPerPage,
                this.nameFilter,
                this.sortField,
                this.sortOrder
            );
            this.generateYearOptions();
            this.closeMonthService.getMonths().subscribe({
                next: (res) => {
                    this.allMonths = res.data;
                    console.log(this.allMonths);
                },
                error: (err) => {
                    console.log(err);
                },
            });

            // check for bread crumbs

            this.translate.onLangChange.subscribe(() => {
                this.updateTranslations();
            });

            this.updateTranslations();
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
    }

    editProduct(rowData: any) {
        this.closeMonthService.GetById(rowData.id).subscribe({
            next: (res) => {
                console.log(res.data);
                this.selectedMonthEdit = this.allMonths.find(
                    (month: any) => month.id === res.data.month
                );
                this.selectedYearEdit = res.data.year;
                this.closed = res.data.closed;
                console.log(this.selectedMonthEdit);

                this.product = { ...res.data };
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
        this.closeMonthService.DeleteSoftById(id).subscribe({
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
        // let body = {
        //     month: this.selectedMonth,
        //     year: this.selectedYear,
        //     closed: this.closed,
        // };
        // console.log(body);

        // Confirm add new
        this.closeMonthService.Register(form.value).subscribe({
            next: (res) => {
                console.log(res);
                this.showFormNew = false;
                // show message for success inserted
                if (res.success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: res.message,
                        life: 3000,
                    });
                    // set fields is empty
                    form.reset();
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
        (this.month = null), (this.year = null), (this.newNotes = null);
        this.closed = false;
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

        this.closeMonthService.GetPage(filteredData).subscribe({
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

    saveProduct(id: number, form: FormGroup) {
        this.submitted = true;
        console.log(id);

        form.patchValue({ id: id });

        console.log(form.value);

        // let body = {
        //     id: product.id,
        //     month: this.selectedMonthEdit.id,
        //     year: this.selectedYearEdit,
        //     closed: this.closed,
        // };

        this.closeMonthService.Edit(form.value).subscribe({
            next: (res) => {
                this.hideDialog();
                // show message for user to show processing of deletion.
                if (res.success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: res.message,
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
                }
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

        this.closeMonthService.DeleteRangeSoft(selectedIds).subscribe({
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
        this.sortField = 'monthName';
    }
    generateYearOptions() {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 3;
        const endYear = currentYear + 10;

        for (let year = startYear; year <= endYear; year++) {
            this.allYears.push(year);
        }
    }
    changeMonth(event: any) {
        console.log(event);
        this.selectedMonth = event.value.id;
        console.log(this.selectedMonth);
    }
    changeYear(event: any) {
        console.log('Selected year:', this.selectedYear);
        // Your logic here
    }
}
