import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Globals } from 'src/app/class/globals';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { TranslateService } from '@ngx-translate/core';
import { AttendanceReportService } from './attendance-report.service';
@Component({
    selector: 'app-attendance-report',
    standalone: true,
    imports: [GlobalsModule, PrimeNgModule],
    providers: [MessageService],
    templateUrl: './attendance-report.component.html',
    styleUrl: './attendance-report.component.scss',
})
export class AttendanceReportComponent {
    constructor(
        private attendanceReportService: AttendanceReportService,
        private messageService: MessageService,
        private translate: TranslateService
    ) { }
    @ViewChild('dt') dt: Table;
    @Input() endPoint!: string;
    allData: any[] = [];
    allDataWithoutPagination: any[] = [];
    showTable = false;
    page: number = 1;
    itemsPerPage = 10;
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
    items!: any;
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
        this.endPoint = 'AttendanceSheet';

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.attendanceReportService.setCulture(mainLang);

            // update endpoint
            this.attendanceReportService.setEndPoint(this.endPoint);

            this.getDropDowns();

            if (this.month && this.year)
                this.loadFilteredData();

            this.loadFilteredData()
            this.cols = [
                { field: 'employeeName', header: 'Name' },
                { field: 'code', header: 'Code' },
                { field: 'shiftName', header: 'Shift Name' },
                { field: 'date', header: 'Date' },
                { field: 'checkIn', header: 'Check In' },
                { field: 'checkOut', header: 'Check Out' },
                { field: 'publicVacationId', header: 'Public Vacation ID' },
                { field: 'excuesTypeId', header: 'Excuse Type ID' },
                { field: 'excuseDuration', header: 'Excuse Duration' },
                { field: 'isDynamicWeekEndDay', header: 'Is Dynamic Weekend Day' },
                { field: 'dynamicWeekEndDay', header: 'Dynamic Weekend Day' },
                { field: 'lateMinutes', header: 'Late Minutes' },
                { field: 'workingHoursTime', header: 'Working Hours Time' },
                { field: 'earlyLeaveMinutes', header: 'Early Leave Minutes' },
                { field: 'missionType', header: 'Mission Type' },
                { field: 'overtime', header: 'Overtime' },
                { field: 'shiftCheckInTime', header: 'Shift Check In Time' },
                { field: 'shiftCheckOutTime', header: 'Shift Check Out Time' },
                { field: 'status', header: 'Status' }
            ];

            this.selectedYear = null;

            this.translate.onLangChange.subscribe(() => {
                this.updateTranslations();
            });

            this.updateTranslations();

        });
    }


    updateTranslations() {
        this.items = [
            {
                icon: 'pi pi-home',
                route: '/', label: this.translate.instant("breadcrumb.gen.home"), start: true
            },
            {
                label: this.translate.instant('breadcrumb.cats.reports.title'),
                iconPath: ''
            },
            {
                label: this.translate.instant('breadcrumb.cats.reports.items.attendanceReports.title'),
                iconPath: ''
            },
            {
                label: this.translate.instant(`breadcrumb.cats.reports.items.attendanceReports.items.${this.endPoint}`),
            }];
    }


    editProduct(rowData: any) {
        this.attendanceReportService.GetById(rowData.id).subscribe({
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
        this.attendanceReportService.deleteById(id).subscribe({
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

    loadFilteredData() {
        this.loadData();
    }

    setFieldsNulls() {
        (this.month = null), (this.year = null), (this.newNotes = null);
        this.closed = false;
    }

    loadData() {
        let paginationData = {
            pageNumber: this.page,
            pageSize: this.itemsPerPage,
            sortType: this.sortOrder,
        };

        let employeeData = {
            employeeId: this.employeeId,
            departmentId: this.departmentId,
            month: this.month,
            year: this.year,
        };

        let filteredData = { ...employeeData, ...paginationData };
        filteredData.sortType = this.sortOrder;

        this.loading = true;
        this.attendanceReportService.GetPage(filteredData).subscribe({
            next: (res) => {
                console.log(res);
                this.allData = res.data;
                console.log(res.data);
                this.loading = false;
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

        this.loading = true;

        let paginationData = {
            pageNumber: this.page,
            pageSize: this.itemsPerPage,
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

        this.attendanceReportService.GetPage(filteredData).subscribe({
            next: (res) => {
                this.allData = res.data;
                console.log(res);
                this.totalItems = res.totalItems;
                console.log(res.data.length);
                this.loading = false;

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

        this.attendanceReportService.Edit(form.value).subscribe({
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
        // Translate column headers
        this.translate.get(this.cols.map(col => col.header)).subscribe(translations => {
            const translatedHeaders = this.cols.map(col => translations[col.header]);

            // Format the data
            const formattedData = this.allDataWithoutPagination.map(item => ({
                ...item,
                date: item.date ? new Date(item.date).toISOString().split('T')[0] : '', // Format date as yyyy-MM-dd
                checkIn: item.checkIn ? new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '', // Format time
                checkOut: item.checkOut ? new Date(item.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '' // Format time
            }));

            // Convert data to CSV format with translated headers
            const csvData = this.convertToCSV(formattedData, translatedHeaders);

            // Adding UTF-8 BOM
            const bom = '\uFEFF';
            const csvContent = bom + csvData;

            // Create a Blob with UTF-8 encoding
            const blob = new Blob([csvContent], {
                type: 'text/csv;charset=utf-8;',
            });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${this.endPoint}_${new Date().getTime()}.csv`;
            link.click();
        });
    }

    exportCSV() {
        // Translate column headers
        this.translate.get(this.cols.map(col => col.header)).subscribe(translations => {
            const translatedHeaders = this.cols.map(col => translations[col.header]);

            // Format the data
            const formattedData = this.selectedItems.map(item => ({
                ...item,
                date: item.date ? new Date(item.date).toISOString().split('T')[0] : '', // Format date as yyyy-MM-dd
                checkIn: item.checkIn ? new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '', // Format time
                checkOut: item.checkOut ? new Date(item.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '' // Format time
            }));

            // Convert data to CSV format with translated headers
            const csvData = this.convertToCSV(formattedData, translatedHeaders);

            // Adding UTF-8 BOM
            const bom = '\uFEFF';
            const csvContent = bom + csvData;

            // Create a Blob with UTF-8 encoding
            const blob = new Blob([csvContent], {
                type: 'text/csv;charset=utf-8;',
            });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${this.endPoint}_${new Date().getTime()}.csv`;
            link.click();
        });
    }

    convertToCSV(data: any[], headers: string[]): string {
        if (!data || !data.length) return '';

        const separator = ',';
        const keys = this.cols.map(col => col.field); // Extract fields from `cols`

        const csvContent = data.map(row =>
            keys.map(key => {
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
            }).join(separator)
        );

        csvContent.unshift(headers.join(separator)); // Add translated headers as the first row
        return csvContent.join('\r\n'); // Join all rows
    }


    confirmDeleteSelected() {
        let selectedIds = [];
        console.log('Selected Items :');

        this.selectedItems.forEach((item: any) => {
            selectedIds.push(item.id);
        });

        this.attendanceReportService.DeleteRange(selectedIds).subscribe({
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
            sortType: this.sortOrder,
        };

        // get All Data
        this.getAllRows(form);

        this.loading = true;

        let filteredData = { ...paginationData, ...form.value };

        console.log(filteredData);

        if (form.status == 'VALID') {
            this.attendanceReportService.GetPage(filteredData).subscribe({
                next: (res) => {
                    console.log(res);
                    this.showTable = true;
                    this.allData = res.data;
                    this.loading = false;
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
            // this.getAllData(form.value);
        }
    }


    getAllRows(form: FormGroup) {
        let paginationData = {
            pageNumber: 1,
            ...form.value
        };

        let filteredData = { ...paginationData };

        console.log("body of get all data : ")
        console.log(filteredData);

        this.attendanceReportService.GetPage(filteredData).subscribe({
            next: (res) => {
                console.log(res);
                this.allDataWithoutPagination = res.data;
                console.log("from get all rows: ", this.allDataWithoutPagination)
            },
            error: (err) => {
                console.log(err);
            },
        });
    }



    getDropDowns() {
        this.attendanceReportService.getMonths().subscribe({
            next: (res) => {
                this.allMonths = res.data;
                console.log(this.allMonths);
            },
        });

        this.attendanceReportService
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

        this.attendanceReportService
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

        this.attendanceReportService
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
        this.attendanceReportService.GetPage(body).subscribe({
            next: (res) => {
                console.log(res);
                this.allDataWithoutPagination = res.data;
                console.log("Hello, All Data Without Paginations: ", this.allDataWithoutPagination)
                console.log(res.data);
            },
        });
    }

    printTable() {
        const printContents =
            document.getElementById('printableTableForAllData')?.outerHTML || '';
        const printWindow = window.open('', '_blank');

        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(`
            <html dir=${this.currentLang == 'ar' ? 'rtl' : 'ltr'}>
                <head>
                    <title>${this.translate.instant(
                'Attendance report'
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
