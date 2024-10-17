import { DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Globals } from 'src/app/class/globals';
import { environment } from 'src/environments/environment';
import { AllEmployeeFileService } from './all-employee-file.service';
import { itemsPerPageGlobal } from 'src/main';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';

import * as _ from 'lodash';

@Component({
    selector: 'app-all-employees-file',
    standalone: true,
    imports: [
        GlobalsModule,
        PrimeNgModule,
    ],
    providers: [MessageService, DatePipe],
    templateUrl: './all-employees-file.component.html',
    styleUrl: './all-employees-file.component.scss',
})
export class AllEmployeesFileComponent {
    constructor(
        private employeeFileService: AllEmployeeFileService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private DatePipe: DatePipe
    ) {

        this.initFormGroups();
    }

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
    date!: Date;
    personName!: string;
    hrApproved: boolean = false;
    stockVacation: boolean = false;
    dropdownItemsRelativeRelationType!: any;
    selectedRelativeRelationType!: number;
    selectedRelativeRelation!: any;
    selectedRelativeRelationEdit!: any;
    baseUrlFile: string = environment.mediaUrl;
    file!: File;

    // addNewForm: FormGroup = new FormGroup( {
    //     DocumentRequiredId: new FormControl(null, [Validators.required]),
    //     EmployeeId: new FormControl(null, [Validators.required]) ,
    //     Date: new FormControl(null, [Validators.required]),
    //     Discreption: new FormControl(null),
    //     File:new FormControl(null),
    // });
    // editForm: FormGroup = new FormGroup({
    //     DocumentRequiredId: new FormControl(null, [Validators.required]),
    //     EmployeeId: new FormControl(null, [Validators.required]) ,
    //     Date: new FormControl(null, [Validators.required]),
    //     Discreption: new FormControl(null),
    //     File:new FormControl(null),
    //     Id: new FormControl(1, Validators.required)
    // });


    addNewForm: FormGroup;

    editForm: FormGroup;

    // for all employees customize
    dropdownItemsEmployee: any;
    selectedEmployee: any;
    selectedEmployeeEdit: any;

    ngOnInit() {
        this.endPoint = 'EmployeeFile';

        // this.route.parent?.paramMap.subscribe((params) => {
        //     this.currentId = Number(params.get('id'));
        //     console.log('currentId:', this.currentId);
        // });

        // adding this Configurations in each Component Customized

        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.employeeFileService.setCulture(mainLang);

            // update endpoint
            this.employeeFileService.setEndPoint(this.endPoint);

            // then, load data again to lens on the changes of mainLang & endPoints Call
            this.loadData(
                this.page,
                this.itemsPerPage,
                this.nameFilter,
                this.sortField,
                this.sortOrder
            );


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
            this.getDropDownEmployee();
        });

        // this.initFormGroups();
    }

    initFormGroups() {
        // Define the initial form controls
        let addNewControls = {
            DocumentRequiredId: new FormControl(null, [Validators.required]),
            EmployeeId: new FormControl(null, [Validators.required]),
            Date: new FormControl(null, [Validators.required]),
            Discreption: new FormControl(null),
            File: new FormControl(null),
        };

        // create new clone from object
        let editControls = _.cloneDeep(addNewControls);

        // create from groups itself
        this.addNewForm = new FormGroup(addNewControls);

        this.editForm = new FormGroup( {
            ...editControls,
            Id: new FormControl(null, [Validators.required]),
        });
    }

    editProduct(rowData: any) {
        console.log(rowData.id);
        rowData.date = this.convertDate(rowData.date, 'MM/dd/yyyy');
        this.employeeFileService.GetById(rowData.id).subscribe({
            next: (res) => {
                console.log(res.data);


                this.selectedRelativeRelationEdit =
                    this.dropdownItemsRelativeRelationType.find(
                        (item: any) => item.id == res.data.documentRequiredId
                    );

                this.selectedEmployeeEdit = this.dropdownItemsEmployee.find(
                    (item: any) => item.id == res.data.employeeId
                );

                console.log('selectedRelativeRelationEdit => ');
                console.log(this.selectedRelativeRelationEdit);


                console.log(res.data.date);

                this.product = { ...res.data };
                this.product.date = this.convertDate(res.data.date, 'MM/dd/yyyy');


                console.log("From Edit Product : ");
                console.log("Product Date : ")
                console.log(this.product.date)

                this.editForm.patchValue({
                    DocumentRequiredId: this.selectedRelativeRelationEdit,
                    EmployeeId: this.selectedEmployeeEdit ,
                    Date: this.product.date,
                    Discreption: this.product.discreption,
                    File: this.file,
                    Id: this.product.id
                });

                console.log("Edited Form => ", this.editForm.value)
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
        this.employeeFileService.DeleteRange([id]).subscribe({
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

    getDropDownEmployee() {
        this.employeeFileService.getDropdownField('Employee').subscribe({
            next: (res) => {
                console.log(res);
                this.dropdownItemsEmployee = res.data;
                console.log(this.dropdownItemsEmployee);
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    getFormData(form: FormGroup): any {
        if (form.valid) {
          return form.value; // Return the form data if valid
        } else {
          return null; // Return null if the form is invalid
        }
      }

      mapToFormData(form: FormGroup) {
        const formData: FormData = new FormData();

        for (const key in form) {
            if (form.hasOwnProperty(key)) {
                formData.append(key, form[key]);
            }
        }

        console.log("from mapped => ", formData)
        return formData;
      }

      get formControls() {
        return this.addNewForm.controls;
      }

      get form() {
        return this.addNewForm;
      }

    addNew(form:FormGroup) {
        console.log("this.selectedEmployee => ", this.selectedEmployee);



        form.patchValue({
            DocumentRequiredId: this.selectedRelativeRelation.id,
            EmployeeId: this.selectedEmployee.id,
            Date: this.date,
            Discreption: this.discreption,
            File: this.file,
        });
        console.log(form);


        // this.addNewForm.patchValue({
        //     DocumentRequiredId: this.addNewForm.get('DocumentRequiredId')?.['id'],
        //     EmployeeId: this.addNewForm.get('EmployeeId')?.['id'],
        //     Date: this.convertDate(this.addNewForm.get('Date').value, 'yyyy-MM-ddTHH:mm:ss'),
        // });

        // if(this.addNewForm.valid) {
        //     const formData = this.mapToFormData(this.addNewForm.value);

        //     // Confirm add new
        //     this.employeeFileService.Register(formData).subscribe({
        //         next: (res) => {
        //             console.log(res);
        //             this.showFormNew = false;
        //             // show message for success inserted
        //             this.messageService.add({
        //                 severity: 'success',
        //                 summary: 'Successful',
        //                 detail: 'inserted success',
        //                 life: 3000,
        //             });

        //             // set fields is empty
        //             this.setFieldsNulls();

        //             // load data again
        //             this.loadData(
        //                 this.page,
        //                 this.itemsPerPage,
        //                 this.nameFilter,
        //                 this.sortField,
        //                 this.sortOrder
        //             );
        //         },
        //         error: (err) => {
        //             this.showFormNew = false;
        //             this.messageService.add({
        //                 severity: 'error',
        //                 summary: 'Error',
        //                 detail: err,
        //                 life: 3000,
        //             });
        //         },
        //     });
        // }

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
        this.selectedRelativeRelationType = null;
        this.date = null;
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
        };
        filteredData.sortType = this.sortOrder;

        this.employeeFileService.GetPage(filteredData).subscribe({
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

    saveProduct(id: number, product: any) {
        this.submitted = true;
        console.log(id);
        console.log(product);

        let body = {
            DocumentRequiredId: this.selectedRelativeRelationEdit.id,
            EmployeeId: this.selectedEmployeeEdit.id,
            Date: this.convertDate(product.date, 'yyyy-MM-ddTHH:mm:ss'),
            Discreption: product.discreption,
            Id: product.id,
            File: this.file,
        };
        const formData: FormData = new FormData();

        for (const key in body) {
            if (body.hasOwnProperty(key)) {
                formData.append(key, body[key]);
            }
        }

        this.employeeFileService.Edit(formData).subscribe({
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
                alert(err);
            },
        });
    }

    changeFiles() {
        console.log(this.addNewForm)
    }

    toggleNew() {

        if (this.showFormNew) {
            this.showFormNew = false;
        } else {
            this.showFormNew = true;
            console.log("addNewForm => ", this.addNewForm);


        }

    }

    logForm() {
        console.log("Add New Form : ")
        console.log(this.addNewForm.value);
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

        this.employeeFileService.DeleteRange(selectedIds).subscribe({
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
        this.sortField = 'name';
    }

    convertDate(date: any, format: string) {
        return this.DatePipe.transform(date, format);
    }

    getRelativeRelationTypes() {
        this.employeeFileService
            .getDropdownField('DocumentRequired')
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

    onFileSelect(event: any) {
        console.log(event);

        let file: any = event.currentFiles[0];
        this.file = file;
        console.log(file);
    }
}
