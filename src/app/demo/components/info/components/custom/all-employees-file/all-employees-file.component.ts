import { DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Globals } from 'src/app/class/globals';
import { environment } from 'src/environments/environment';
import { AllEmployeeFileService } from './all-employee-file.service';
import { itemsPerPageGlobal } from 'src/main';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-all-employees-file',
    standalone: true,
    imports: [GlobalsModule, PrimeNgModule],
    providers: [MessageService, DatePipe],
    templateUrl: './all-employees-file.component.html',
    styleUrl: './all-employees-file.component.scss',
})
export class AllEmployeesFileComponent {
    constructor(
        private employeeFileService: AllEmployeeFileService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private DatePipe: DatePipe,
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
    loading: boolean = false;
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

    // for all employees customize
    dropdownItemsEmployee: any;
    selectedEmployee: any;
    selectedEmployeeEdit: any;

    addNewForm!: FormGroup;
    editForm!: FormGroup;
    items: any;

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

            this.initFormGroups();

            // update breadcrumb
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
                label: this.translate.instant('breadcrumb.cats.employeeProfiles.title'),
                iconPath: ''
            },
            {
                label: this.translate.instant(`breadcrumb.cats.employeeProfiles.items.${this.endPoint}`),
            }];
    }

    initFormGroups() {
        this.addNewForm = new FormGroup({
            DocumentRequiredId: new FormControl(null, Validators.required),
            EmployeeId: new FormControl(null, Validators.required),
            Date: new FormControl(null, Validators.required),
            Discreption: new FormControl(null, Validators.required),
            File: new FormControl(null),
        });

        this.editForm = new FormGroup({
            Id: new FormControl(null, Validators.required),
            DocumentRequiredId: new FormControl(null, Validators.required),
            EmployeeId: new FormControl(null, Validators.required),
            Date: new FormControl(null, Validators.required),
            Discreption: new FormControl(null, Validators.required),
            File: new FormControl(null),
        });
    }

    editProduct(rowData: any) {
        console.log(rowData.id);
        this.loading = true;

        rowData.date = this.convertDate(rowData.date, 'MM/dd/yyyy');
        this.employeeFileService.GetById(rowData.id).subscribe({
            next: (res) => {
                this.loading = false;

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

                res.data.date = this.convertDate(res.data.date, 'MM/dd/yyyy');
                console.log(res.data.date);

                this.product = { ...res.data };
                this.productDialog = true;
            },

            error: () => {
                this.loading = false;
                this.hideDialog();
            }
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
        this.loading = true;

        // perform delete from sending request to api
        this.employeeFileService.DeleteRange([id]).subscribe({
            next: () => {
                this.loading = false;

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

            error: () => {
                this.loading = false;
                this.hideDialog();
            }
        });
    }

    getDropDownEmployee() {
        this.employeeFileService.getDropdownField('Employee').subscribe({
            next: (res) => {
                console.log(res);
                this.dropdownItemsEmployee = res.data;
                console.log(this.dropdownItemsEmployee);
            },
        });
    }

    addNew() {
        this.addNewForm.patchValue({
            DocumentRequiredId: this.selectedRelativeRelationType,
            EmployeeId: this.selectedEmployee.id,
            Date: this.convertDate(this.date, 'yyyy-MM-ddTHH:mm:ss'),
            Discreption: this.discreption,
            File: this.file,
        });

        if (this.addNewForm.valid) {
            // map To Form Data
            const formData = this.mapToFormData(this.addNewForm.value);

            this.loading = true;

            // Confirm add new
            this.employeeFileService.Register(formData).subscribe({

                next: (res) => {

                    this.loading = false;

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

                error: () => {
                    this.loading = false;
                }
            });
        }
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
        let filteredData = {
            pageNumber: page,
            pageSize: size,
            filterValue: nameFilter,
            filterType: filterType,
            sortType: sortType,
        };
        filteredData.sortType = this.sortOrder;

        this.loading = true;


        this.employeeFileService.GetPage(filteredData).subscribe({
            next: (res) => {

                console.log(res);
                this.allData = res.data;
                console.log(res.data);

                this.totalItems = res.totalItems;
                console.log(this.selectedItems);
                this.loading = false;

            },

            error: () => {
                this.loading = false;
                this.hideDialog();
            }
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

        this.editForm.patchValue({
            DocumentRequiredId: this.selectedRelativeRelationEdit.id,
            Id: product.id,
            EmployeeId: this.selectedEmployeeEdit.id,
            Date: this.convertDate(product.date, 'yyyy-MM-ddTHH:mm:ss'),
            PersonName: product.personName,
            Discreption: product.discreption,
            File: this.file,
        });

        if (this.editForm.valid) {
            const formData = this.mapToFormData(this.editForm.value);

            this.loading = true;

            this.employeeFileService.Edit(formData).subscribe({
                next: () => {
                    this.loading = false;

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

                error: () => {
                    this.loading = false;
                }
            });
        }
    }

    toggleNew() {
        if (this.showFormNew) {
            this.showFormNew = false;
        } else {
            this.showFormNew = true;
        }
    }

    exportCSV() {
        // Translate column headers
        this.translate.get(this.cols.map(col => col.header)).subscribe(translations => {
            const translatedHeaders = this.cols.map(col => translations[col.header]);

            // Convert data to CSV format with translated headers
            const csvData = this.convertToCSV(this.selectedItems, translatedHeaders);



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
        let keys = this.cols.map(row => row.field); // Extract fields from `cols`

        const csvContent = data.map(row =>
            keys.map(key => `"${row[key] ?? ''}"`).join(separator) // Handle undefined values
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

        this.loading = true;

        this.employeeFileService.DeleteRange(selectedIds).subscribe({
            next: (res) => {
                this.loading = false;

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

            error: () => {
                this.loading = false;
                this.hideDialog();
            }
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
