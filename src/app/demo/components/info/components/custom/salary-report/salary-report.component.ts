import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Globals } from 'src/app/class/globals';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { itemsPerPageGlobal } from 'src/main';
import { TranslateService } from '@ngx-translate/core';
import { SalaryReportService } from './salary-report.service';
@Component({
    selector: 'app-salary-report',
    standalone: true,
    imports: [GlobalsModule, PrimeNgModule],
    providers: [MessageService],
    templateUrl: './salary-report.component.html',
    styleUrl: './salary-report.component.scss',
})
export class SalaryReportComponent {
    constructor(
        private monthlyAbsenceReportService: SalaryReportService,
        private messageService: MessageService,
        private translate: TranslateService
    ) { }
    @ViewChild('dt') dt: Table;
    @Input() endPoint!: string;
    allData: any[] = [];
    allDataWithoutPagination: any[] = [];
    showTable = false;
    page: number = 1;
    itemsPerPage = 5;
    selectedItems: any = [];
    cols: any[] = [];
    totalItems: any;
    loading: boolean = true;
    nameFilter: string = '';
    employeeId!: number;
    departmentId!: number;
    month!: number;
    year!: number;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    submitted: boolean = false;
    productDialog: boolean = false;
    product: any;
    event!: any;
    newNotes!: string;
    showFormNew: boolean = false;
    sortField: string = 'employeeName';
    currentLang = localStorage.getItem('currentLang') ?? null;
    sortOrder: string = 'asc';
    allMonths: any = [];
    closed: boolean = false;
    selectedMonth: any = null;
    selectedMonthEdit: any;
    selectedDepartment: any = null;
    selectedYear: any = null;
    selectedYearEdit: number;
    selectedEmployeeEdit: any = null;
    dropdownItemsVacationTypes: any;
    dropdownItemsManagers: any;
    dropdownItemsEmployees: any;
    dropdownItemsDepartments: any;
    selectedYearAdd: any = null;
    filterForm: FormGroup = new FormGroup({
        employeeId: new FormControl(null),
        departmentId: new FormControl(null),
        month: new FormControl(null, [Validators.required]),
        year: new FormControl(null, [Validators.required]),
    });
    addNewForm: FormGroup = new FormGroup({
        employeeId: new FormControl(null, [Validators.required]),
        month: new FormControl(null, [Validators.required]),
        value: new FormControl(null, [Validators.required, Validators.min(0)]),
        year: new FormControl(null, [
            Validators.required,
            Validators.min(1900),
            Validators.max(2199),
        ]),
        notes: new FormControl(null),
    });

    editForm: FormGroup = new FormGroup({
        employeeId: new FormControl(null, [Validators.required]),
        month: new FormControl(null, [Validators.required]),
        value: new FormControl(null, [Validators.required, Validators.min(0)]),
        year: new FormControl(null, [
            Validators.required,
            Validators.min(1900),
            Validators.max(2199),
        ]),
        notes: new FormControl(null),
        id: new FormControl(null),
    });

    ngOnInit() {
        this.endPoint = 'Salary';

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.monthlyAbsenceReportService.setCulture(mainLang);

            // update endpoint
            this.monthlyAbsenceReportService.setEndPoint(this.endPoint);

            this.getDropDowns();

            if (this.month && this.year)
                this.loadFilteredData();

            // then, load data again to lens on the changes of mainLang & endPoints Call
            // this.loadData(
            //     this.page,
            //     this.itemsPerPage,
            //     this.nameFilter,
            //     this.sortField,
            //     this.sortOrder
            // );
        });
        this.cols = [
            { field: 'employeeName', header: 'Name' },
            { field: 'departmentName', header: 'Department Name' },
            { field: 'year', header: 'Year' },
            { field: 'basicSalary', header: 'basicSalry' }, // Ensure to use the correct translation key
            { field: 'changing', header: 'changing' },
            { field: 'badal', header: 'badal' },
            { field: 'hawafez', header: 'hawafez' },
            { field: 'kpi', header: 'kpi' },
            { field: 'penaltiesAndDeduction', header: 'penaltiesAndDeduction' },
            { field: 'bonus', header: 'bonus' },
            { field: 'daysOfAbsence', header: 'daysOfAbsence' },
            { field: 'daysOfAbsenceValue', header: 'daysOfAbsenceValue' },
            { field: 'daysOfDelay', header: 'daysOfDelay' },
            { field: 'daysOfDelayValue', header: 'daysOfDelayValue' },
            { field: 'fingerPrintForgetting', header: 'fingerPrintForgetting' },
            { field: 'fingerPrintForgettingValue', header: 'fingerPrintForgettingValue' },
            { field: 'overTimeValue', header: 'overTimeValue' },
            { field: 'initialPayment', header: 'initialpayment' },
            { field: 'insuranceAmount', header: 'insuranceAmount' },
            { field: 'totalMonthlyAllowance', header: 'totalMonthlyAllowance' },
        ];
        this.selectedYear = null;
    }

    editProduct(rowData: any) {
        this.monthlyAbsenceReportService.GetById(rowData.id).subscribe({
            next: (res) => {
                console.log(res.data);
                this.selectedMonthEdit = this.allMonths.find(
                    (month: any) => month.id === res.data.month
                );
                this.selectedYearEdit = res.data.year;
                console.log(this.dropdownItemsEmployees);
                this.selectedEmployeeEdit = this.getObjectById(
                    res.data.employeeId,
                    this.dropdownItemsEmployees
                );
                console.log(this.selectedEmployeeEdit);

                console.log(this.selectedMonthEdit);

                this.product = { ...res.data };
                this.productDialog = true;
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
        this.monthlyAbsenceReportService.deleteById(id).subscribe({
            next: () => {
                // close dialog
                this.deleteProductDialog = false;

                // show message for user to show processing of deletion.
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Item Deleted',
                    life: 3000,
                });

                // load data here
                // this.loadData(
                //     this.page,
                //     this.itemsPerPage,
                //     this.nameFilter,
                //     this.sortField,
                //     this.sortOrder
                // );
            },
        });
    }

    addNew(form: FormGroup) {
        // Confirm add new
        this.monthlyAbsenceReportService.Register(form.value).subscribe({
            next: (res) => {
                console.log(res);
                this.showFormNew = false;
                if (res.success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'inserted successfully',
                        life: 3000,
                    });

                    // set fields is empty
                    form.reset();

                    // load data again
                    // this.loadData(
                    //     this.page,
                    //     this.itemsPerPage,
                    //     this.nameFilter,
                    //     this.sortField,
                    //     this.sortOrder
                    // );
                }
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
            this.employeeId,
            this.departmentId,
            this.month,
            this.year
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
        sortType: string,
        employeeId: number,
        departmentId: number,
        month: number,
        year: number
    ) {
        // this.loading = true;
        let filteredData = {
            PageNumber: page,
            PageSize: size,
            FilterValue: nameFilter,
            FilterType: filterType,
            SortType: sortType,
            EmployeeId: employeeId,
            DepartmentId: departmentId,
            Month: month,
            Year: year,
        };
        filteredData.SortType = this.sortOrder;
        const formData = this.mapToFormData(filteredData);

        console.log('FilteredData');
        console.log(filteredData);

        this.monthlyAbsenceReportService.GetPage(formData).subscribe({
            next: (res) => {
                console.log(res);
                this.allData = res.data;
                console.log(res.data);

                this.totalItems = res.totalItems;
                this.loading = false;
                console.log(this.selectedItems);
            },
        });
    }


    mapToFormData(body: any) {
        const formData: FormData = new FormData();

        for (const key in body) {
            if (body.hasOwnProperty(key)) {
                formData.append(key, body[key]);
            }
        }

        return formData;
    }

    onPageChange(event: any) {
        let x: string;
        console.log(event);
        this.page = Number(event.first / event.rows) + 1;
        x = event.sortOrder === 1 ? 'asc' : 'dsc';
        this.sortOrder = x;
        this.itemsPerPage = event.rows;
        // console.log(this.sortOrder);

        let paginationData = {
            pageNumber: this.page,
            pageSize: this.itemsPerPage,
            filterValue: this.nameFilter,
            filterType: this.sortField,
            sortType: this.sortOrder,
        };

        let employeeData = {
            employeeId: this.employeeId,
            departmentId: this.departmentId,
            month: this.month,
            year: this.year,
        };

        let filteredData = { ...employeeData, ...paginationData };

        console.log(filteredData);

        this.monthlyAbsenceReportService.GetPage(filteredData).subscribe({
            next: (res) => {
                this.allData = res.data;
                console.log(res);
                this.totalItems = res.totalItems;
                console.log(res.data.length);
            },
            error: (err) => {
                console.log(err);
            },
        });
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
        form.patchValue({
            id: id,
        });

        console.log(form.value);

        this.monthlyAbsenceReportService.Edit(form.value).subscribe({
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
                    // this.loadData(
                    //     this.page,
                    //     this.itemsPerPage,
                    //     this.nameFilter,
                    //     this.sortField,
                    //     this.sortOrder
                    // );
                }
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
    exportAllCSV() {
        const csvData = this.convertToCSV(this.allDataWithoutPagination);

        // Adding UTF-8 BOM
        const bom = '\uFEFF';
        const csvContent = bom + csvData;

        // Create a Blob with UTF-8 encoding
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = this.endPoint + '_' + new Date().getTime() + '.csv';
        link.click();
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
        link.download = this.endPoint + '_' + new Date().getTime() + '.csv';
        link.click();
    }

    convertToCSV(data: any[]): string {
        if (!data || !data.length) return '';

        const separator = ',';

        // Get the headers from the `cols` array
        const headers = this.cols
            .map((col) => `"${col.header}"`)
            .join(separator);

        // Get the field names for mapping data
        const keys = this.cols.map((col) => col.field);

        // Map the data rows
        const csvContent = data.map((row) =>
            keys
                .map((key) => {
                    if (key === 'absentDates' && Array.isArray(row[key])) {
                        // Format absentDates
                        return `"${row[key]
                            .map((date: string) =>
                                new Date(date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: '2-digit',
                                })
                            )
                            .join('  -  ')}"`;
                    } else {
                        return `"${row[key] || ''}"`; // Handle other fields
                    }
                })
                .join(separator)
        );

        // Add the header row at the beginning
        csvContent.unshift(headers);

        // Join all rows with newline
        return csvContent.join('\r\n');
    }

    confirmDeleteSelected() {
        let selectedIds = [];
        console.log('Selected Items :');

        this.selectedItems.forEach((item: any) => {
            selectedIds.push(item.id);
        });

        this.monthlyAbsenceReportService.DeleteRange(selectedIds).subscribe({
            next: (res) => {
                this.deleteProductsDialog = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'items deleted successfully',
                    life: 3000,
                });
                this.selectedItems = [];

                // this.loadData(
                //     this.page,
                //     this.itemsPerPage,
                //     this.nameFilter,
                //     this.sortField,
                //     this.sortOrder
                // );
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

    changeMonth(event: any) {
        console.log(event);
        this.selectedMonth = event.value.id;
        console.log(this.selectedMonth);
    }
    changeYear(event: any) {
        console.log('Selected year:', this.selectedYear);
    }

    submitForm(form: FormGroup) {
        console.log(form.value);
        let paginationData = {
            pageNumber: 1,
            pageSize: this.itemsPerPage,
            filterValue: this.nameFilter,
            filterType: this.sortField,
            sortType: this.sortOrder,
        };

        let filteredData = { ...form.value, ...paginationData };
        console.log(filteredData);

        if (form.status == 'VALID') {
            this.monthlyAbsenceReportService.GetPage(filteredData).subscribe({
                next: (res) => {
                    console.log(res);
                    this.showTable = true;
                    this.allData = res.data;
                    console.log(res.data);
                    this.totalItems = res.totalItems;
                    this.employeeId = form.value.employeeId;
                    this.departmentId = form.value.departmentId;
                    this.month = form.value.month;
                    this.year = form.value.year;

                    console.log(res.data.length);
                    console.log(this.totalItems);
                },
                error: (err) => {
                    console.log(err);
                },
            });
            this.getAllData(form.value);
        }
    }
    getDropDowns() {
        this.monthlyAbsenceReportService.getMonths().subscribe({
            next: (res) => {
                this.allMonths = res.data;
                console.log(this.allMonths);
            },
        });

        this.monthlyAbsenceReportService
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

        this.monthlyAbsenceReportService
            .getDropdownField('Department')
            .subscribe({
                next: (res) => {
                    console.log(res.data);
                    this.dropdownItemsDepartments = res.data;
                },
                error: (err) => {
                    console.log(err);
                },
            });

        this.monthlyAbsenceReportService
            .getDropdownField('Location')
            .subscribe({
                next: (res) => {
                    console.log(res.data);
                    this.dropdownItemsVacationTypes = res.data;
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }
    getObjectById(id: number, arr: any[]) {
        return arr.find((person) => person.id === id);
    }

    getAllData(body: any) {
        this.monthlyAbsenceReportService.GetPage(body).subscribe({
            next: (res) => {
                console.log(res);
                this.allDataWithoutPagination = res.data;
                console.log(res.data);
            },
        });
    }

    printTable() {
        const printContents =
            document.getElementById('printableTable')?.outerHTML || '';
        const printWindow = window.open('', '_blank');

        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(`
            <html dir=${this.currentLang == 'ar' ? 'rtl' : 'ltr'}>
                <head>
                    <title>${this.translate.instant(
                'report'
            )}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                        }
                        table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: center;
                            max-width: fit-content
                        }
                        th {
                            background-color: #f4f4f4;
                        }
                        h2 {
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    ${printContents}
                </body>
            </html>
        `);
            printWindow.document.close();
            printWindow.print();
        }
    }
}
