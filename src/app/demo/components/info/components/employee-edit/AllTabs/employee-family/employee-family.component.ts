import { DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Globals } from 'src/app/class/globals';
import { ActivatedRoute, Data } from '@angular/router';
import { EmployeeFamilyService } from './employee-family.service';
import { itemsPerPageGlobal } from 'src/main';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';

@Component({
    selector: 'app-employee-family',
    standalone: true,
    imports: [GlobalsModule, PrimeNgModule],
    providers: [MessageService, DatePipe],
    templateUrl: './employee-family.component.html',
    styleUrls: ['./employee-family.component.scss'],
})
export class EmployeeFamilyComponent {
    constructor(
        private employeeFamilyService: EmployeeFamilyService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private DatePipe: DatePipe
    ) { }

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
    discreption!: string;
    showFormNew: boolean = false;
    sortField: string = 'id';
    sortOrder: string = 'asc';
    currentId!: number;
    courseName!: string;
    birthdate!: Date;
    personName!: string;
    hrApproved: boolean = false;
    stockVacation: boolean = false;
    dropdownItemsRelativeRelationType!: any;
    selectedRelativeRelationType!: number;
    selectedRelativeRelation!: any;
    selectedRelativeRelationEdit!: any;

    ngOnInit() {
        this.endPoint = 'EmployeeFamily';
        this.route.parent?.paramMap.subscribe((params) => {
            this.currentId = Number(params.get('id'));
            console.log('currentId:', this.currentId);
        });

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.employeeFamilyService.setCulture(mainLang);

            // update endpoint
            this.employeeFamilyService.setEndPoint(this.endPoint);

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
        this.getRelativeRelationTypes();
    }

    editProduct(rowData: any) {
        console.log(rowData.id);
        rowData.birthDate = this.convertDate(rowData.birthDate, 'MM/dd/yyyy');
        this.employeeFamilyService.GetById(rowData.id).subscribe({
            next: (res) => {
                console.log(res.data);
                this.selectedRelativeRelationEdit =
                    this.dropdownItemsRelativeRelationType.find(
                        (item: any) => item.id == res.data.relativeRelationId
                    );
                console.log('selectedRelativeRelationEdit => ');
                console.log(this.selectedRelativeRelationEdit);

                res.data.birthDate = this.convertDate(
                    res.data.birthDate,
                    'MM/dd/yyyy'
                );
                console.log(res.data.date);

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

    startAttendeesTimeClick(event: any) { }

    endAttendeesTimeClick(event: any) { }

    confirmDelete(id: number) {
        // perform delete from sending request to api
        this.employeeFamilyService.DeleteRange([id]).subscribe({
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

    addNew() {
        // first convert from date full format to time only
        // why? because prime ng calender component returned the value as a full Date Format

        // set body of request
        let body = {
            relativeRelationId: this.selectedRelativeRelationType,
            employeeId: this.currentId,
            birthDate: this.convertDate(this.birthdate, 'yyyy-MM-ddTHH:mm:ss'),
            personName: this.personName,
            discreption: this.discreption,
        };

        console.log(body);

        // Confirm add new
        this.employeeFamilyService.Register(body).subscribe({
            next: (res) => {
                console.log(res);
                this.showFormNew = false;
                // show message for success inserted
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'inserted success',
                    life: 3000,
                });

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
            error: (err) => {
                this.showFormNew = false;
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
        this.selectedRelativeRelationType = null;
        this.birthdate = null;
        this.personName = null;
        this.discreption = null;
        this.selectedRelativeRelation = null;
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
            employeeId: this.currentId,
        };
        filteredData.sortType = this.sortOrder;

        this.employeeFamilyService.GetPage(filteredData).subscribe({
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

    saveProduct(id: number, product: any) {
        this.submitted = true;
        console.log(id);
        console.log(product);

        let body = {
            relativeRelationId: this.selectedRelativeRelationEdit.id,
            employeeId: this.currentId,
            birthDate: this.convertDate(
                product.birthDate,
                'yyyy-MM-ddTHH:mm:ss'
            ),
            personName: product.personName,
            discreption: product.discreption,
            id: product.id,
        };

        this.employeeFamilyService.Edit(body).subscribe({
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

        this.employeeFamilyService.DeleteRange(selectedIds).subscribe({
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
    convertDate(date: any, format: string) {
        return this.DatePipe.transform(date, format);
    }
    getRelativeRelationTypes() {
        this.employeeFamilyService
            .getDropdownField('RelativeRelation')
            .subscribe({
                next: (res) => {
                    console.log(res);
                    this.dropdownItemsRelativeRelationType = res.data;
                    console.log(this.dropdownItemsRelativeRelationType);
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }
    selectRelativeRelation(event: any) {
        console.log(event);
        this.selectedRelativeRelationType = event.value.id;
        this.selectedRelativeRelation = event.value;
    }
    selectedRelativeRelationEditFun(event: any) {
        this.selectedRelativeRelationEdit = event.value;
    }
}
