import { Component, Input, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Globals } from 'src/app/class/globals';
import { itemsPerPageGlobal } from 'src/main';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LoanRequestService } from './loan-request.service';

@Component({
    selector: 'app-loan-request',
    standalone: true,
    imports: [GlobalsModule, PrimeNgModule],
    providers: [MessageService],
    templateUrl: './loan-request.component.html',
    styleUrl: './loan-request.component.scss',
})
export class LoanRequestComponent {
    constructor(
        private loanRequestService: LoanRequestService,
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
    newName!: string;
    newNotes!: string;
    showFormNew: boolean = false;
    sortField: string = 'id';
    sortOrder: string = 'asc';
    newNameAr!: string;
    newNameEn!: string;

    newLatitude: DoubleRange;
    newLongitude: DoubleRange;
    newDiscription: string;

    dropdownItemsEmployees!: any;
    dropdownItemsLoanTypes!: any;
    dropdownItemsResponseTypes!: any;
    dropdownItemsRepaymentTerms!: any;

    acceptRequestDialogue: boolean = false;
    rejectRequestDialogue: boolean = false;
    notesAccept: string;
    notesReject: string;
    acceptAllDialogue: boolean = false;
    rejectAllDialogue: boolean = false;

    addNewForm: FormGroup = new FormGroup({
        EmployeeId: new FormControl(null, [Validators.required]),
        LoanTypeId: new FormControl(null, [Validators.required]),
        RepaymentTermId: new FormControl(null, [Validators.required]),
        Reason: new FormControl(null, [Validators.required]),
        Amount: new FormControl(null, [Validators.required]),
        Notes: new FormControl(null),
    });

    editForm: FormGroup = new FormGroup({
        employeeId: new FormControl(null, [Validators.required]),
        loanTypeId: new FormControl(null, [Validators.required]),
        repaymentTermId: new FormControl(null, [Validators.required]),
        reason: new FormControl(null, [Validators.required]),
        amount: new FormControl(null, [Validators.required]),
        notes: new FormControl(null),
        id: new FormControl(null),
    });

    ngOnInit() {
        this.endPoint = 'LoanRequests';

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.loanRequestService.setCulture(mainLang);

            // update endpoint
            this.loanRequestService.setEndPoint(this.endPoint);

            // then, load data again to lens on the changes of mainLang & endPoints Call
            this.loadData(
                this.page,
                this.itemsPerPage,
                this.nameFilter,
                this.sortField,
                this.sortOrder
            );
        });
        this.getAllDropdowns();

        this.cols = [
            // basic data
            { field: 'name', header: 'Name' },

            // custom fields
            { field: 'latitude', header: 'Lotes' },
            { field: 'longitude', header: 'Longitude' },
            { field: 'discription', header: 'Discription' },
            { field: 'notes', header: 'Notes' },

            // Generic Fields
            { field: 'creationTime', header: 'creationTime' },
            { field: 'lastModificationTime', header: 'lastModificationTime' },
            { field: 'creatorName', header: 'creatorName' },
            { field: 'lastModifierName', header: 'lastModifierName' },
        ];
    }
    getAllDropdowns() {
        this.loanRequestService.getDropdownEnum('getRequestType').subscribe({
            next: (res) => {
                console.log(res.data);
                this.dropdownItemsResponseTypes = res.data;
                console.log(this.dropdownItemsResponseTypes);
            },
            error: (err) => {
                console.log(err);
            },
        });

        this.loanRequestService.getDropdownField('Employee').subscribe({
            next: (res) => {
                console.log(res.data);
                this.dropdownItemsEmployees = res.data;
                console.log(this.dropdownItemsEmployees);
            },
            error: (err) => {
                console.log(err);
            },
        });

        this.loanRequestService.getDropdownField('LoanTypes').subscribe({
            next: (res) => {
                console.log(res.data);
                this.dropdownItemsLoanTypes = res.data;
                console.log(this.dropdownItemsLoanTypes);
            },
            error: (err) => {
                console.log(err);
            },
        });

        this.loanRequestService.getDropdownField('RepaymentTerms').subscribe({
            next: (res) => {
                console.log(res.data);
                this.dropdownItemsRepaymentTerms = res.data;
                console.log(this.dropdownItemsRepaymentTerms);
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    editProduct(rowData: any) {
        console.log(rowData.id);
        this.loanRequestService.GetById(rowData.id).subscribe({
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

    confirmDelete(id: number) {
        // perform delete from sending request to api
        this.loanRequestService.DeleteSoftById(id).subscribe({
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
        console.log(form);

        const formData: FormData = new FormData();

        for (const key in form.value) {
            if (form.value.hasOwnProperty(key)) {
                formData.append(key, form.value[key]);
            }
        }

        this.loanRequestService.Register(formData).subscribe({
            next: (res) => {
                console.log(res);
                this.showFormNew = false;
                if (res.success) {
                    // show message for success inserted
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translate.instant('Success'),
                        detail: res.message,
                        life: 3000,
                    });
                    // set fields is empty
                    form.reset();
                }

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

                console.log(err);
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
            (this.newNotes = null),
            (this.newDiscription = null),
            (this.newLatitude = null),
            (this.newLongitude = null);
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
            status: 0,
        };
        filteredData.sortType = this.sortOrder;

        this.loanRequestService.getPageOfAcceptedLoan(filteredData).subscribe({
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

    saveProduct(id: number, form: FormGroup) {
        this.submitted = true;
        console.log(id);
        form.patchValue({
            id: id,
        });

        this.loanRequestService.Edit(form.value).subscribe({
            next: (res) => {
                this.hideDialog();

                if (res.success) {
                    // show message for user to show processing of deletion.
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translate.instant('Success'),
                        detail: res.message,
                        life: 3000,
                    });
                }

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

    splitCamelCase(str: any) {
        return str
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .replace(/\s+/g, ' ')
            .split(' ')
            .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
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

        this.loanRequestService.DeleteRangeSoft(selectedIds).subscribe({
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
    acceptRequest(product: any) {
        this.acceptRequestDialogue = true;
        this.product = { ...product };
    }
    rejectRequest(product: any) {
        this.rejectRequestDialogue = true;
        this.product = { ...product };
    }

    confirmAccept(rowData: any) {
        console.log(rowData);
        let body = {
            id: rowData.id,
            status: 1,
            notes: this.notesAccept,
        };

        this.loanRequestService.updateRequestType(body).subscribe({
            next: (res) => {
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
        });
        this.notesAccept = '';
    }
    confirmReject(rowData: any) {
        console.log(rowData);

        let body = {
            id: rowData.id,
            status: 2,
            notes: this.notesReject,
        };
        this.loanRequestService.updateRequestType(body).subscribe({
            next: (res) => {
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
        });
        this.notesReject = '';
    }
}
