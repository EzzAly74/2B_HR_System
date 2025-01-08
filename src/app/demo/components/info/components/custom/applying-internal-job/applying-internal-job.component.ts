import { Component, Input, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { ApplyingInternalJobService } from './applying-internal-job.service';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Globals } from 'src/app/class/globals';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-applying-internal-job',
    standalone: true,
    imports: [GlobalsModule, PrimeNgModule],
    providers: [MessageService, DatePipe],
    templateUrl: './applying-internal-job.component.html',
    styleUrl: './applying-internal-job.component.scss',
})
export class ApplyingInternalJobComponent {
    constructor(
        private _ApplyingInternalJobService: ApplyingInternalJobService,
        private messageService: MessageService,
        private translate: TranslateService
    ) {}

    @ViewChild('dt') dt: Table;
    @Input() endPoint!: string;
    allData: any;
    page: number = 1;
    itemsPerPage = 5;
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
    fileNew!: File;
    all_Status_DropDown: any;
    changeStatusForm: FormGroup = new FormGroup({
        Status: new FormControl(null, Validators.required),
    });
    ngOnInit() {
        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            this.endPoint = 'ApplyingInternalJob';

            // update mainLang at Service
            this._ApplyingInternalJobService.setCulture(mainLang);

            // update endpoint
            this._ApplyingInternalJobService.setEndPoint(this.endPoint);

            // then, load data again to lens on the changes of mainLang & endPoints Call
            this.loadData(
                this.page,
                this.itemsPerPage,
                this.nameFilter,
                this.sortField,
                this.sortOrder
            );

            if (mainLang == 'en') {
                this.all_Status_DropDown = [
                    { id: 0, name: 'Applied' },
                    { id: 1, name: 'InConsideration' },
                    { id: 2, name: 'Hired' },
                    { id: 3, name: 'NotSelected' },
                ];
            } else {
                this.all_Status_DropDown = [
                    { id: 0, name: 'تم التقديم' },
                    { id: 1, name: 'في الاعتبار' },
                    { id: 2, name: 'تم التعيين' },
                    { id: 3, name: 'لم يتم التعيين' },
                ];
            }
        });

        this.cols = [
            // basic data
            { field: 'name', header: 'Name' },
            { field: 'notes', header: 'Notes' },

            // Generic Fields
            { field: 'creationTime', header: 'CreationTime' },
            { field: 'lastModificationTime', header: 'LastModificationTime' },
            { field: 'creatorName', header: 'CreatorName' },
            { field: 'lastModifierName', header: 'LastModifierName' },
        ];
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

    editProduct(rowData: any) {
        console.log(rowData.id);
        this._ApplyingInternalJobService.GetById(rowData.id).subscribe({
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
        this._ApplyingInternalJobService.DeleteSoftById(id).subscribe({
            next: (res) => {
                // close dialog
                this.deleteProductDialog = false;

                // show message for user to show processing of deletion.
                this.messageService.add({
                    severity: 'success',
                    summary: this.translate.instant('Success'),
                    detail: res.message,
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
        console.log(form);

        this._ApplyingInternalJobService.Register(form.value).subscribe({
            next: (res) => {
                if (res.success) {
                    console.log(res);
                    this.showFormNew = false;
                    // show message for success inserted
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translate.instant('Success'),
                        detail: res.message,
                        life: 3000,
                    });
                    form.reset();
                }

                // set fields is empty
                this.setFieldsNulls();

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
            PageNumber: page,
            PageSize: size,
            FilterValue: nameFilter,
            FilterType: filterType,
            SortType: sortType,
        };
        filteredData.SortType = this.sortOrder;

        const formData = this.mapToFormData(filteredData);

        this._ApplyingInternalJobService.GetPage(formData).subscribe({
            next: (res) => {
                console.log(res);
                this.allData = res.data;
                console.log(res.data);

                this.totalItems = res.totalItems;
                this.loading = false;
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

    saveStatus(form: FormGroup, product: any) {
        this.submitted = true;

        let body = {
            ...form.value,
            Id: product.id,
        };

        const formData = this.mapToFormData(body);

        this._ApplyingInternalJobService.changeStatus(formData).subscribe({
            next: (res) => {
                if (res.success) {
                    this.hideDialog();
                    // show message for user to show processing of deletion.
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translate.instant('Success'),
                        detail: res.message,
                        life: 3000,
                    });
                }

                this.loading = false;

                // load data again
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
            },
        });
    }

    toggleNew() {
        if (this.showFormNew) {
            this.showFormNew = false;
            this.changeStatusForm.reset();
        } else {
            this.showFormNew = true;
            this.changeStatusForm.reset();
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
        link.download = `${this.endPoint}_${new Date().getTime()}.csv`;
        link.click();
    }

    convertToCSV(data: any[]): string {
        console.log(data);
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

    mapToFormData(body: any) {
        const formData: FormData = new FormData();

        for (const key in body) {
            if (body.hasOwnProperty(key)) {
                formData.append(key, body[key]);
            }
        }

        return formData;
    }
    confirmDeleteSelected() {
        let selectedIds = [];
        console.log('Selected Items :');

        this.selectedItems.forEach((item: any) => {
            selectedIds.push(item.id);
        });

        this.loading = true;

        this._ApplyingInternalJobService
            .DeleteRangeSoft(selectedIds)
            .subscribe({
                next: (res) => {
                    this.deleteProductsDialog = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translate.instant('Success'),
                        detail: res.message,
                        life: 3000,
                    });
                    // this.selectedItems = [];
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
                    this.deleteProductsDialog = false;
                    this.loading = false;
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

    onFileSelect(event: any) {
        console.log(event);
        let file: any = event.currentFiles[0];

        if (file) {
            this.fileNew = file;

            let body = {
                file: this.fileNew,
            };
            const formData: FormData = new FormData();

            for (const key in body) {
                if (body.hasOwnProperty(key)) {
                    formData.append(key, body[key]);
                }
            }
            this._ApplyingInternalJobService.importExcel(formData).subscribe({
                next: (res) => {
                    console.log(res);
                    console.log('ezzzz');

                    this.loadData(
                        this.page,
                        this.itemsPerPage,
                        this.nameFilter,
                        this.sortField,
                        this.sortOrder
                    );

                    this.messageService.add({
                        severity: 'success',
                        summary: this.translate.instant('Success'),
                        detail: res?.['message'],
                        life: 3000,
                    });
                },
            });
        }
    }
}
