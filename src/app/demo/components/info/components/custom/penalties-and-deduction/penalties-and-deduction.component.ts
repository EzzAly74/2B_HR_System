import { DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Globals } from 'src/app/class/globals';
import { ActivatedRoute } from '@angular/router';
import { itemsPerPageGlobal } from 'src/main';
import { PenaltiesAndDeductionService } from './penalties-and-deduction.service';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-penalties-and-deduction',
    standalone: true,
    imports: [GlobalsModule, PrimeNgModule],
    providers: [MessageService, DatePipe],
    templateUrl: './penalties-and-deduction.component.html',
    styleUrl: './penalties-and-deduction.component.scss',
})
export class PenaltiesAndDeductionComponent {
    items: any = [];

    constructor(
        private penaltiesAndDeductionService: PenaltiesAndDeductionService,
        private messageService: MessageService,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private DatePipe: DatePipe
    ) { }

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


    @ViewChild('dt') dt: Table;
    @Input() endPoint!: string;
    allData: any = [];
    page: number = 1;
    itemsPerPage = itemsPerPageGlobal;
    selectedItems: any = [];
    cols: any[] = [];
    totalItems: any;
    loading: boolean = false;
    nameFilter: string = '';
    acceptRequestDialogue: boolean = false;
    rejectRequestDialogue: boolean = false;
    deleteProductsDialog: boolean = false;
    submitted: boolean = false;
    productDialog: boolean = false;
    product: any;
    event!: any;
    reason!: string;
    showFormNew: boolean = false;
    sortField: string = 'id';
    sortOrder: string = 'asc';
    currentId!: number;
    newEmplyeeId: any = null;
    newMissonTypeId: any = null;
    dateFrom!: Date;
    dateTo!: Date;
    location: string = null;
    hrApproved: boolean = false;
    stockVacation: boolean = false;
    dropdownItemsManagers!: any;
    dropdownItemsEmployees!: any;
    dropdownItemsRequestTypes!: any;
    dropdownItemsMissionTypes!: any;
    ids: number[] = [];
    selectedEmployee: any = null;
    selectedManager: any = null;
    selectedRequstType: any = null;
    filterForm: FormGroup = new FormGroup({
        employeeId: new FormControl(null),
        mangerId: new FormControl(null),
        dateFrom: new FormControl(),
        dateTo: new FormControl(null),
        requestType: new FormControl(null),
    });
    allMonths: any[] = [];
    allYears: number[] = [];
    selectedYear: number;
    selectedMonth: any;
    addNewForm: FormGroup = new FormGroup({
        employeeId: new FormControl(null),
        reason: new FormControl(null),
        fromDay: new FormControl(null),
        toDay: new FormControl(null),
        missionType: new FormControl(null),
        location: new FormControl(null),
    });
    notesAccept: string;
    notesReject: string;
    acceptAllDialogue: boolean = false;
    rejectAllDialogue: boolean = false;

    ngOnInit() {
        this.endPoint = 'PenaltiesAndDeduction';
        this.route.parent?.paramMap.subscribe((params) => {
            this.currentId = Number(params.get('id'));
            console.log('currentId:', this.currentId);
        });

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.penaltiesAndDeductionService.setCulture(mainLang);

            // update endpoint
            this.penaltiesAndDeductionService.setEndPoint(this.endPoint);

            // then, load data again to lens on the changes of mainLang & endPoints Call
            this.loadData(
                this.page,
                this.itemsPerPage,
                this.nameFilter,
                this.sortField,
                this.sortOrder
            );
            console.log('Dropdowns data :');

            this.getDropDowns();

            // check for items for bread crumbs 
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
        this.generateYearOptions();
        this.selectedMonth = this.getMonthObjById(new Date().getMonth() + 1);
        console.log(this.selectedMonth);
    }

    getDropDowns() {
        this.penaltiesAndDeductionService
            .getDropdownField('Employee')
            .subscribe({
                next: (res) => {
                    console.log(res.data);
                    this.dropdownItemsEmployees = res.data;
                },
                error: (err) => {
                    console.log(err);
                },
            });
        this.penaltiesAndDeductionService.getMonthDropdown().subscribe({
            next: (res) => {
                this.allMonths = res.data;
                this.selectedMonth = this.getMonthObjById(
                    new Date().getMonth() + 1
                );
            },
            error: (err) => {
                console.log(err);
            },
        });

        this.penaltiesAndDeductionService.getManagerDropdown().subscribe({
            next: (res) => {
                console.log(res.data);
                this.dropdownItemsManagers = res.data;
            },
            error: (err) => {
                console.log(err);
            },
        });

        this.penaltiesAndDeductionService.getRequestTypeDropdown().subscribe({
            next: (res) => {
                console.log(res.data);
                this.dropdownItemsRequestTypes = res.data;
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

    confirmAccept(rowData: any) {
        console.log(rowData);
        let body = {
            id: rowData.id,
            requestType: 1,
            notes: this.notesAccept,
        };

        this.loading = true;

        this.penaltiesAndDeductionService.updateRequestType(body).subscribe({
            next: (res) => {
                this.loading = false;

                console.log(res);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Request Accepted Successfully',
                    life: 3000,
                });
                this.acceptRequestDialogue = false;
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
                this.hideDialog();
            }
        });
        this.notesAccept = '';
    }
    confirmReject(rowData: any) {
        console.log(rowData);

        let body = {
            id: rowData.id,
            requestType: 2,
            notes: this.notesReject,
        };
        this.loading = true;

        this.penaltiesAndDeductionService.updateRequestType(body).subscribe({
            next: (res) => {
                this.loading = false;

                console.log(res);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Request Rejected Successfully',
                    life: 3000,
                });
                this.rejectRequestDialogue = false;
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
                this.hideDialog();
            }
        });
        this.notesReject = '';
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
        this.newEmplyeeId = null;
        this.newMissonTypeId = null;
        this.dateFrom = null;
        this.dateTo = null;
        this.location = null;
        this.reason = null;
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

        this.penaltiesAndDeductionService.GetPage(filteredData).subscribe({
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

    acceptRequest(product: any) {
        this.acceptRequestDialogue = true;
        this.product = { ...product };
    }
    rejectRequest(product: any) {
        this.rejectRequestDialogue = true;
        this.product = { ...product };
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

        this.loading = true;

        this.penaltiesAndDeductionService.DeleteRange(selectedIds).subscribe({
            next: (res) => {
                this.loading = false;

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
                this.loading = false;

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
        this.sortField = 'employeeName';
    }
    convertDate(date: any, format: string) {
        return this.DatePipe.transform(date, format);
    }
    submitForm(form: FormGroup) {
        const currentMonthValue = form.get('month')?.value;
        const apiData = {
            ...form.value, // other form fields remain unchanged
            dateFrom: this.DatePipe.transform(
                form.value.dateFrom,
                'yyyy-MM-dd'
            ),
            dateTo: this.DatePipe.transform(form.value.dateTo, 'yyyy-MM-dd'),
        };

        console.log(form.value);
        const removeNulls = (obj: any) => {
            return Object.fromEntries(
                Object.entries(obj).filter(([_, value]) => value !== null)
            );
        };
        const formValueNotNull = removeNulls(apiData);

        const filterPaginator = {
            PageNumber: this.page,
            PageSize: this.itemsPerPage,
            FilterValue: this.nameFilter,
            FilterType: this.sortField,
            SortType: this.sortOrder,
        };

        const filteredData = { ...formValueNotNull, ...filterPaginator };
        console.log(form);

        if (form.status == 'VALID') {
            this.loading = true;

            this.penaltiesAndDeductionService.GetPage(filteredData).subscribe({
                next: (res) => {
                    this.loading = false;

                    this.allData = res.data;
                    console.log(res.data);
                },
                error: (err) => {
                    this.loading = false;

                    console.log(err);
                },
            });
        }

        form.patchValue({ month: currentMonthValue });
    }
    getMonthNameById(monthId: number) {
        const month = this.allMonths.find((month) => month.id === monthId);
        return month ? month.name : '';
    }

    getMonthObjById(monthId: number) {
        const month = this.allMonths.find((month) => month.id === monthId);
        return month;
    }
    generateYearOptions() {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 3;
        const endYear = currentYear + 10;

        for (let year = startYear; year <= endYear; year++) {
            this.allYears.push(year);
        }
    }
    confirmAcceptAll() {
        console.log('Accept All');
        console.log(this.selectedItems);
        // let ids: number[] = [];

        this.selectedItems.forEach((item: any) => {
            if (item.requestType == 0) this.ids.push(item.id);
        });

        console.log(this.ids);

        this.loading = true;

        this.penaltiesAndDeductionService
            .updateRequestTypeRange(this.ids, 1)
            .subscribe({
                next: (res) => {
                    console.log(res);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'All Requests Accepted Successfully',
                        life: 3000,
                    });
                    this.acceptAllDialogue = false;
                    this.ids = [];
                    this.loadData(
                        this.page,
                        this.itemsPerPage,
                        this.nameFilter,
                        this.sortField,
                        this.sortOrder
                    );
                    this.loading = false;

                },
                error: (err) => {
                    this.loading = false;
                },
            });
    }
    confirmRejectAll() {
        console.log('Reject All');
        console.log(this.selectedItems);

        this.selectedItems.forEach((item: any) => {
            if (item.requestType == 0) this.ids.push(item.id);
        });

        this.loading = true;

        this.penaltiesAndDeductionService
            .updateRequestTypeRange(this.ids, 2)
            .subscribe({
                next: (res) => {
                    this.loading = false;

                    console.log(res);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'All Requests Rejected Successfully',
                        life: 3000,
                    });
                    this.rejectAllDialogue = false;
                    this.ids = [];
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
    isDisabled(): boolean {
        return (
            !this.selectedItems?.length ||
            !this.selectedItems?.some((item) => item.requestType === 0)
        );
    }
}
