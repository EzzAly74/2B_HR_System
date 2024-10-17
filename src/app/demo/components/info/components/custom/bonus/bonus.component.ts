import { BonusService } from './bonus.service';
import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Globals } from 'src/app/class/globals';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { itemsPerPageGlobal } from 'src/main';

@Component({
    selector: 'app-bonus',
    standalone: true,
    imports: [
        GlobalsModule,
        PrimeNgModule,
    ],
    providers: [MessageService],
    templateUrl: './bonus.component.html',
    styleUrl: './bonus.component.scss',
})
export class BonusComponent {
    selectedEmployee: any = null;
    selectedManager: any = null;
    selectedVacationType: any = null;
    dropdownItemsVacationTypes: any;
    dropdownItemsManagers: any;
    dropdownItemsEmployees: any;
    dropdownItemsDepartments: any;
    selectedEmployeeAdd: any;
    selectedMonthAdd: any;
    constructor(
        private bonusService: BonusService,
        private messageService: MessageService
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
    newNotes!: string;
    showFormNew: boolean = false;
    sortField: string = 'id';
    sortOrder: string = 'asc';
    allMonths: any = [];
    month!: number;
    year!: number;
    closed: boolean = false;
    selectedMonth: any = null;
    selectedMonthEdit: any;
    allYears: any[] = [];
    selectedDepartment: any = null;
    selectedYear: any = null;
    selectedYearEdit: number;
    selectedEmployeeEdit: any = null;

    selectedYearAdd: any = null;
    filterForm: FormGroup = new FormGroup({
        employeeId: new FormControl(null),
        mangerId: new FormControl(null),
        departmentId: new FormControl(null),
        month: new FormControl(null),
        year: new FormControl(null),
    });
    addNewForm: FormGroup = new FormGroup({
        employeeId: new FormControl(null),
        month: new FormControl(null),
        value: new FormControl(null),
        year: new FormControl(null),
        notes: new FormControl(null),
    });

    ngOnInit() {
        this.endPoint = 'Bouns';

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.bonusService.setCulture(mainLang);

            // update endpoint
            this.bonusService.setEndPoint(this.endPoint);

            // then, load data again to lens on the changes of mainLang & endPoints Call
            this.loadData(
                this.page,
                this.itemsPerPage,
                this.nameFilter,
                this.sortField,
                this.sortOrder
            );
            this.generateYearOptions();
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

        this.bonusService.getMonths().subscribe({
            next: (res) => {
                this.allMonths = res.data;
                console.log(this.allMonths);
            },
           
        });

        this.getDropDowns();
        console.log(this.allYears);
        this.selectedYear = null;
    }

    editProduct(rowData: any) {
        this.bonusService.GetById(rowData.id).subscribe({
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

    startAttendeesTimeClick(event: any) {}

    endAttendeesTimeClick(event: any) {}

    confirmDelete(id: number) {
        // perform delete from sending request to api
        this.bonusService.deleteById(id).subscribe({
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

    addNew(form: FormGroup) {
        form.patchValue({
            employeeId: this.selectedEmployeeAdd?.id ?? null,
            month: this.selectedMonthAdd?.id ?? null,
            year: this.selectedYearAdd?.value ?? null,
        });

        // Confirm add new
        this.bonusService.Register(form.value).subscribe({
            next: (res) => {
                console.log(res);
                this.showFormNew = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'inserted successfully',
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
            },
         
        });

        console.log(form);

        // first convert from date full format to time only
        // why? because prime ng calender component returned the value as a full Date Format

        // set body of request
        // let body = {
        //     month: this.selectedMonth,
        //     year: this.selectedYear,
        //     closed: this.closed,
        // };

        // console.log(body);
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
        this.loading = true;
        let filteredData = {
            pageNumber: page,
            pageSize: size,
            filterValue: nameFilter,
            filterType: filterType,
            sortType: sortType,
        };
        filteredData.sortType = this.sortOrder;

        this.bonusService.GetPage(filteredData).subscribe({
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

    saveProduct(id: number, product: any) {
        this.submitted = true;
        console.log(id);
        console.log(product);

        let body = {
            id: product.id,
            month: this.selectedMonthEdit.id,
            year: this.selectedYearEdit,
            employeeId: this.selectedEmployeeEdit.id,
            value: product.value,
            notes: product.notes,
        };

        console.log(body);

        this.bonusService.Edit(body).subscribe({
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

        this.bonusService.DeleteRange(selectedIds).subscribe({
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
        this.sortField = 'employeeName';
    }
    generateYearOptions() {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 3;
        const endYear = currentYear + 10;

        for (let year = startYear; year <= endYear; year++) {
            this.allYears.push({ label: `${year}`, value: year });
        }
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
        form.patchValue({
            employeeId: this.selectedEmployee?.id ?? null,
            mangerId: this.selectedManager?.id ?? null,
            departmentId: this.selectedDepartment?.id ?? null,
            month: this.selectedMonth?.id ?? null,
            year: this.selectedYear?.value ?? null,
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

        if (form.status == 'VALID') {
            this.bonusService.GetPage(filteredData).subscribe({
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
    getDropDowns() {
        this.bonusService.getDropdownField('Employee').subscribe({
            next: (res) => {
                console.log(res.data);
                this.dropdownItemsEmployees = res.data;
            },
            error: (err) => {
                console.log(err);
            },
        });

        this.bonusService.getDropdownField('Department').subscribe({
            next: (res) => {
                console.log(res.data);
                this.dropdownItemsDepartments = res.data;
            },
            error: (err) => {
                console.log(err);
            },
        });

        this.bonusService.getManagerDropdown().subscribe({
            next: (res) => {
                console.log(res.data);
                this.dropdownItemsManagers = res.data;
            },
            error: (err) => {
                console.log(err);
            },
        });

        this.bonusService.getDropdownField('Location').subscribe({
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
}
