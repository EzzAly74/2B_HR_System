import { Component, Input, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ShiftService } from './shift.service';
import { Globals } from 'src/app/class/globals';
import { itemsPerPageGlobal } from 'src/main';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-shift',
    templateUrl: './shift.component.html',
    styleUrl: './shift.component.scss',
    standalone: true,
    imports: [GlobalsModule, PrimeNgModule],
    providers: [MessageService],
})
export class ShiftComponent {
    constructor(
        private _ShiftService: ShiftService,
        private messageService: MessageService,
        private translate: TranslateService
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

    newNameAr!: string;
    newNameEn!: string;
    numberOfHours!: number;
    startAttendeesTime: Date;
    endAttendeesTime: Date;

    checkInBeforeTheShiftStarts: number;
    checkOutAfterTheShiftEnds: number;
    checkOutAfterTheShiftStarts: number;

    addNewForm: FormGroup = new FormGroup({
        checkInBeforeTheShiftStarts: new FormControl(null, [
            Validators.required,
        ]),
        checkOutAfterTheShiftEnds: new FormControl(null, [Validators.required]),
        checkOutAfterTheShiftStarts: new FormControl(null, [
            Validators.required,
        ]),
        endAttendeesTime: new FormControl(null, [Validators.required]),
        engName: new FormControl(null, [Validators.required]),
        name: new FormControl(null, [Validators.required]),
        numberOfHours: new FormControl(null, [Validators.required]),
        startAttendeesTime: new FormControl(null, [Validators.required]),
        notes: new FormControl(null),
    });

    editForm: FormGroup = new FormGroup({
        checkInBeforeTheShiftStarts: new FormControl(null, [
            Validators.required,
        ]),
        checkOutAfterTheShiftEnds: new FormControl(null, [Validators.required]),
        checkOutAfterTheShiftStarts: new FormControl(null, [
            Validators.required,
        ]),
        endAttendeesTime: new FormControl(null, [Validators.required]),
        engName: new FormControl(null, [Validators.required]),
        name: new FormControl(null, [Validators.required]),
        numberOfHours: new FormControl(null, [Validators.required]),
        startAttendeesTime: new FormControl(null, [Validators.required]),
        notes: new FormControl(null),
        id: new FormControl(null),
    });

    ngOnInit() {
        this.endPoint = 'Shift';

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this._ShiftService.setCulture(mainLang);

            // update endpoint
            this._ShiftService.setEndPoint(this.endPoint);

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
            { field: 'startAttendeesTime', header: 'StartAttendeesTime' },
            { field: 'endAttendeesTime', header: 'EndAttendeesTime' },
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
        console.log(rowData.id);
        this._ShiftService.GetById(rowData.id).subscribe({
            next: (res) => {
                console.log(res.data);
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

    startAttendeesTimeClick(event: any) {}

    endAttendeesTimeClick(event: any) {}

    confirmDelete(id: number) {
        // perform delete from sending request to api
        this._ShiftService.DeleteSoftById(id).subscribe({
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
        form.patchValue({
            startAttendeesTime: form
                .get('startAttendeesTime')
                .value.toLocaleTimeString('en-US', { hour12: false }),
            endAttendeesTime: form
                .get('endAttendeesTime')
                .value.toLocaleTimeString('en-US', { hour12: false }),
        });

        console.log(form);

        // set body of request

        // Confirm add new
        this._ShiftService.Register(form.value).subscribe({
            next: (res) => {
                console.log(res);
                this.showFormNew = false;
                // show message for success inserted
                if (res.success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translate.instant('Success'),
                        detail: res.message,
                        life: 3000,
                    });
                }
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
        (this.newNameAr = null),
            (this.newNameEn = null),
            (this.newNotes = null);
        (this.numberOfHours = null),
            (this.startAttendeesTime = null),
            (this.endAttendeesTime = null);
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

        this._ShiftService.GetPage(filteredData).subscribe({
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

    saveProduct(id: number, form: FormGroup) {
        this.submitted = true;
        console.log(id);

        form.patchValue({
            startAttendeesTime: form
                .get('startAttendeesTime')
                .value.toLocaleTimeString('en-US', { hour12: false }),
            endAttendeesTime: form
                .get('endAttendeesTime')
                .value.toLocaleTimeString('en-US', { hour12: false }),
            id: id,
        });

        console.log(form);

        this._ShiftService.Edit(form.value).subscribe({
            next: (res) => {
                this.hideDialog();
                // show message for user to show processing of deletion.
                if (res.success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translate.instant('Success'),
                        detail: res.message,
                        life: 3000,
                    });
                }

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

        this._ShiftService.DeleteRangeSoft(selectedIds).subscribe({
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
        this.sortField = 'name';
    }
}
