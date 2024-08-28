import { CommonModule, DatePipe, Time } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Globals } from 'src/app/class/globals';
import { ActivatedRoute, Data } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { VacationRequestService } from './vacation-request.service';
import { environment } from 'src/environments/environment';

export const dateRangeValidator: ValidatorFn = (formGroup: FormGroup) => {
    const dateFrom = formGroup.get('FromDay')?.value;
    const dateTo = formGroup.get('ToDay')?.value;

    // Check if one date is provided and the other is not
    if ((dateFrom && !dateTo) || (!dateFrom && dateTo)) {
        return { dateRangeIncomplete: true }; // Return error object if validation fails
    }

    return null; // Return null if validation passes
};
@Component({
    selector: 'app-vacation-request',
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
        TranslateModule,
        InputSwitchModule,
        PanelModule,
    ],
    providers: [MessageService, DatePipe],
    templateUrl: './vacation-request.component.html',
    styleUrl: './vacation-request.component.scss',
})
export class VacationRequestComponent {
    constructor(
        private vacationRequestService: VacationRequestService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private DatePipe: DatePipe
    ) {}
    @ViewChild('dt') dt: Table;
    @Input() endPoint!: string;
    baseUrlFile: string = environment.mediaUrl;
    allData: any = [];
    page: number = 1;
    itemsPerPage = 10;
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
    dropdownItemsVacationTypes!: any;
    selectedEmployee: any = null;
    selectedManager: any = null;
    selectedRequstType: any = null;
    selectedVacationType: any = null;
    file!: File;
    filterForm: FormGroup = new FormGroup({
        EmployeeId: new FormControl(null),
        MangerId: new FormControl(null),
        DateFrom: new FormControl(null),
        DateTo: new FormControl(null),
        VacationTypeId: new FormControl(null),
        RequestType: new FormControl(null),
    });

    addNewForm: FormGroup = new FormGroup(
        {
            EmployeeId: new FormControl(null),
            FromDay: new FormControl(null),
            ToDay: new FormControl(null),
            VacationTypeId: new FormControl(null),
            Reason: new FormControl(null),
            File: new FormControl(null),
        },
        { validators: dateRangeValidator }
    );

    ngOnInit() {
        this.endPoint = 'VacationRequest';
        this.route.parent?.paramMap.subscribe((params) => {
            this.currentId = Number(params.get('id'));
            console.log('currentId:', this.currentId);
        });

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.vacationRequestService.setCulture(mainLang);

            // update endpoint
            this.vacationRequestService.setEndPoint(this.endPoint);

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
    getDropDowns() {
        this.vacationRequestService.getDropdownField('Employee').subscribe({
            next: (res) => {
                console.log(res.data);
                this.dropdownItemsEmployees = res.data;
            },
            error: (err) => {
                console.log(err);
            },
        });

        this.vacationRequestService.getManagerDropdown().subscribe({
            next: (res) => {
                console.log(res.data);
                this.dropdownItemsManagers = res.data;
            },
            error: (err) => {
                console.log(err);
            },
        });

        this.vacationRequestService.getRequestTypeDropdown().subscribe({
            next: (res) => {
                console.log(res.data);
                this.dropdownItemsRequestTypes = res.data;
            },
            error: (err) => {
                console.log(err);
            },
        });
        this.vacationRequestService.getDropdownField('VacationType').subscribe({
            next: (res) => {
                console.log(res.data);
                this.dropdownItemsVacationTypes = res.data;
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

    confirmDelete(rowData: any) {
        console.log(rowData);

        // perform delete from sending request to api
        if (rowData.requestType === 0) {
            console.log(rowData);

            this.vacationRequestService
                .deleteVacationRequestById(rowData.id)
                .subscribe({
                    next: (res) => {
                        // close dialog
                        this.deleteProductDialog = false;
                        console.log(res.data);

                        // show message for user to show processing of deletion.
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Vacation Request Deleted',
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
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Cannot delete external mission that is already accepted or rejected',
                life: 3000,
            });
        }
    }

    addNew(form: FormGroup) {
        form.patchValue({
            EmployeeId: this.newEmplyeeId?.id ?? null,
            VacationTypeId: this.newMissonTypeId?.id ?? null,
            File: this.file ?? null,

            FromDay: this.DatePipe.transform(
                form.get('FromDay')?.value ?? null,
                'yyyy-MM-dd'
            ),
            ToDay: this.DatePipe.transform(
                form.get('ToDay')?.value ?? null,
                'yyyy-MM-dd'
            ),
        });
        console.log(form);

        const formData: FormData = new FormData();

        for (const key in form.value) {
            if (form.value.hasOwnProperty(key)) {
                formData.append(key, form.value[key]);
            }
        }

        if (form.status == 'VALID') {
            this.vacationRequestService.addVacationRequest(formData).subscribe({
                next: (res) => {
                    console.log(res.data);
                    this.showFormNew = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Vacation Request Sent Successfully',
                        life: 3000,
                    });
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
        this.loading = true;
        let filteredData = {
            pageNumber: page,
            pageSize: size,
            filterValue: nameFilter,
            filterType: filterType,
            sortType: sortType,
        };
        const formData: FormData = new FormData();

        for (const key in filteredData) {
            if (filteredData.hasOwnProperty(key)) {
                formData.append(key, filteredData[key]);
            }
        }
        filteredData.sortType = this.sortOrder;

        this.vacationRequestService.GetPage(formData).subscribe({
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

        this.vacationRequestService.DeleteRange(selectedIds).subscribe({
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
        this.sortField = 'employeeName';
    }
    convertDate(date: any, format: string) {
        return this.DatePipe.transform(date, format);
    }
    submitForm(form: FormGroup) {
        form.patchValue({
            EmployeeId: this.selectedEmployee?.id ?? null,
            MangerId: this.selectedManager?.id ?? null,
            RequestType: this.selectedRequstType?.id ?? null,
            VacationTypeId: this.selectedVacationType?.id ?? null,

            DateFrom: this.DatePipe.transform(
                form.get('DateFrom')?.value ?? null,
                'yyyy-MM-dd'
            ),
            DateTo: this.DatePipe.transform(
                form.get('DateTo')?.value ?? null,
                'yyyy-MM-dd'
            ),
        });

        console.log(form.value);
        const removeNulls = (obj: any) => {
            return Object.fromEntries(
                Object.entries(obj).filter(([_, value]) => value !== null)
            );
        };
        const formValueNotNull = removeNulls(form.value);

        const filterPaginator = {
            PageNumber: this.page,
            PageSize: this.itemsPerPage,
            FilterValue: this.nameFilter,
            FilterType: this.sortField,
            SortType: this.sortOrder,
        };

        const filteredData = { ...formValueNotNull, ...filterPaginator };
        console.log(filteredData);

        const formData: FormData = new FormData();

        for (const key in filteredData) {
            if (filteredData.hasOwnProperty(key)) {
                formData.append(key, filteredData[key]);
            }

            if (form.status == 'VALID') {
                this.vacationRequestService.GetPage(formData).subscribe({
                    next: (res) => {
                        this.allData = res.data;
                        console.log(res.data);
                    },
                    error: (err) => {
                        console.log(err);
                    },
                });
            }
        }
    }
    onFileSelect(event: any) {
        console.log(event);

        let file: any = event.currentFiles[0];
        this.file = file;
        console.log(file);
    }
}
