import { DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Globals } from 'src/app/class/globals';
import { ActivatedRoute } from '@angular/router';
import { itemsPerPageGlobal } from 'src/main';
import { EmployeeWeekendService } from './employee-weekend.service';
import {
    FormControl,
    FormGroup,
    ValidatorFn,
} from '@angular/forms';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
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
    selector: 'app-employee-weekend',
    standalone: true,
    imports: [
        GlobalsModule,
        PrimeNgModule,
    ],
    providers: [MessageService, DatePipe],
    templateUrl: './employee-weekend.component.html',
    styleUrl: './employee-weekend.component.scss',
})
export class EmployeeWeekendComponent {
    constructor(
        private employeeWeekendService: EmployeeWeekendService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private DatePipe: DatePipe
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
    discription!: string;
    showFormNew: boolean = false;
    sortField: string = 'id';
    sortOrder: string = 'asc';
    currentId!: number;
    courseName!: string;
    dateFrom!: Date;
    dateTo!: Date;
    location!: string;
    hrApproved: boolean = false;
    stockVacation: boolean = false;
    filterForm: FormGroup = new FormGroup({
        EmployeeId: new FormControl(null),
        MangerId: new FormControl(null),
        DateFrom: new FormControl(null),
        DateTo: new FormControl(null),
        LocationId: new FormControl(null),
    });
    dropdownItemsManagers!: any;
    dropdownItemsEmployees!: any;
    dropdownItemsRequestTypes!: any;
    dropdownItemsVacationTypes!: any;
    selectedEmployee: any = null;
    selectedManager: any = null;
    selectedRequstType: any = null;
    selectedVacationType: any = null;

    ngOnInit() {
        this.endPoint = 'EmployeeWeekend';
        this.route.parent?.paramMap.subscribe((params) => {
            this.currentId = Number(params.get('id'));
            console.log('currentId:', this.currentId);
        });

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.employeeWeekendService.setCulture(mainLang);

            // update endpoint
            this.employeeWeekendService.setEndPoint(this.endPoint);

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
        this.getDropDowns();
    }
    getDropDowns() {
        this.employeeWeekendService.getDropdownField('Employee').subscribe({
            next: (res) => {
                console.log(res.data);
                this.dropdownItemsEmployees = res.data;
            },
            error: (err) => {
                console.log(err);
            },
        });

        this.employeeWeekendService.getManagerDropdown().subscribe({
            next: (res) => {
                console.log(res.data);
                this.dropdownItemsManagers = res.data;
            },
            error: (err) => {
                console.log(err);
            },
        });

        this.employeeWeekendService.getDropdownField('Location').subscribe({
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

    loadFilteredData() {
        this.loadData(
            this.page,
            this.itemsPerPage,
            this.nameFilter,
            this.sortField,
            this.sortOrder
        );
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
            PageNumber: page,
            PageSize: size,
            FilterValue: nameFilter,
            FilterType: filterType,
            SortType: sortType,
            EmployeeId: this.currentId,
        };
        filteredData.SortType = this.sortOrder;
        const formData: FormData = new FormData();

        for (const key in filteredData) {
            if (filteredData.hasOwnProperty(key)) {
                formData.append(key, filteredData[key]);
            }
        }

        this.employeeWeekendService.GetPage(formData).subscribe({
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

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
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
    submitForm(form: FormGroup) {
        form.patchValue({
            EmployeeId: this.currentId,
            MangerId: this.selectedManager?.id ?? null,
            LocationId: this.selectedVacationType?.id ?? null,

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
            EmployeeId :this.currentId
        };

        const filteredData = { ...formValueNotNull, ...filterPaginator };
        console.log(filteredData);

        const formData: FormData = new FormData();

        for (const key in filteredData) {
            if (filteredData.hasOwnProperty(key)) {
                formData.append(key, filteredData[key]);
            }

            if (form.status == 'VALID') {
                this.employeeWeekendService.GetPage(formData).subscribe({
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
}
