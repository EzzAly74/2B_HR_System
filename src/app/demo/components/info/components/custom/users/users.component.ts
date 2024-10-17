import { Component, Input, ViewChild } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Globals } from 'src/app/class/globals';
import { UsersService } from './users.service';
import { itemsPerPageGlobal } from 'src/main';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
export const passwordMatchValidator: ValidatorFn = (formGroup: FormGroup) => {
    const password = formGroup.get('password')?.value;
    const rePassword = formGroup.get('rePassword')?.value;

    // Check if password and rePassword are not equal
    if (password !== rePassword) {
        return { passwordMismatch: true }; // Return error object if validation fails
    }
    return null; // Return null if validation passes
};

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        GlobalsModule,
        PrimeNgModule,
    ],
    providers: [MessageService],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
})
export class UsersComponent {
    constructor(
        private usersService: UsersService,
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
    productLockDialog: boolean = false;
    changePassDialog: boolean = false;
    newPassword!: string;
    rePassword!: string;
    product: any;
    event!: any;
    newNotes!: string;
    showFormNew: boolean = false;
    sortField: string = 'id';
    sortOrder: string = 'asc';
    allMonths: any = [];
    month!: number;
    year!: number;
    locked: boolean = false;
    selectedMonth: number;
    selectedMonthEdit: any;
    allYears: number[] = [];
    selectedYear: number;
    selectedYearEdit: number;
    rolesDropdown!: any;
    selectedMulti!: any[];

    userId!: number;
    changePassForm: FormGroup = new FormGroup(
        {
            password: new FormControl(null, [
                Validators.required,
                Validators.minLength(5),
            ]),
            rePassword: new FormControl(null, [
                Validators.required,
                Validators.minLength(5),
            ]),
        },
        { validators: passwordMatchValidator }
    );

    ngOnInit() {
        this.endPoint = 'UsersApp';

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.usersService.setCulture(mainLang);

            // update endpoint
            this.usersService.setEndPoint(this.endPoint);

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
        this.getRolesDropdown();
    }

    editProduct(rowData: any) {
        this.usersService.GetById(rowData.id).subscribe({
            next: (res) => {
                console.log(res.data);
                this.product = { ...res.data };
                this.productDialog = true;
                this.selectedMulti = this.product.roles;
                console.log(this.selectedMulti);
            },
            error: (err) => {
                console.log(err);
            },
        });
        console.log(rowData.id);
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
        this.locked = false;
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

        this.usersService.GetPage(filteredData).subscribe({
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
    changePassword(id: number) {
        this.changePassDialog = true;
        console.log(id);
        this.userId = id;
    }
    getRolesDropdown() {
        this.usersService.getDropdownField('Roles').subscribe({
            next: (res) => {
                this.rolesDropdown = res.data;
                console.log('rolesDropdown =>');
                console.log(this.rolesDropdown);
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
    selectMultiItems(event: any) {
        console.log(event);
        console.log(this.selectedMulti);
    
        this.selectedMulti = event.value;
    }
    saveRoles(id: number) {
        console.clear();
        console.log(id);
        console.log(this.selectedMulti);

        let selectedIds = [] ;  

        this.selectedMulti.forEach((item)=>{
            selectedIds.push(item.id); 
        });
        console.log(selectedIds);
        



        this.usersService.assignRoles(id, selectedIds).subscribe({
            next: (res) => {
                console.log(res);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Role assigned successfully',
                    life: 3000,
                });
                this.productDialog = false;
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
                this.productDialog = false;
            },
        });
        selectedIds = [] ;
    }
    editProductLock(rowData: any) {
        this.usersService.GetById(rowData.id).subscribe({
            next: (res) => {
                console.log(res.data);
                this.product = { ...res.data };
                this.productLockDialog = true;
                this.locked = res.data.isLocked;
            },
            error: (err) => {
                console.log(err);
            },
        });
        console.log(rowData.id);
    }
    saveLock(id: number) {
        let body = {
            isLocked: this.locked,
            userId: id,
        };
        this.usersService.updateUserLocked(body).subscribe({
            next: (res) => {
                console.log(res);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Lock Updated Successfully',
                    life: 3000,
                });
                this.productLockDialog = false;
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
    submitChangePassForm(id: number, form: FormGroup) {
        console.log(id);

        if (form.status == 'VALID') {
            this.usersService.changePassword(id, form.value).subscribe({
                next: (res) => {
                    console.log(res);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'You Changed Password Successfully',
                        life: 3000,
                    });
                    this.changePassDialog = false;
                },
                error: (err) => {
                    console.log(err);
                },
            });
        }
    }
    hideDialogPassword() {
        this.changePassDialog = false;
    }
    hideDialogLock() {
        this.productLockDialog = false;
    }
}
