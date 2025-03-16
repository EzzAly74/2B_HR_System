import { DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Globals } from 'src/app/class/globals';
import { AllEmployeeCovenantService } from './all-employee-covenant.service';
import { itemsPerPageGlobal } from 'src/main';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'app-all-employees-covenant',
    imports: [GlobalsModule, PrimeNgModule],
    providers: [MessageService, DatePipe],
    templateUrl: './all-employees-covenant.component.html',
    styleUrl: './all-employees-covenant.component.scss',
})
export class AllEmployeesCovenantComponent {
    constructor(
        private employeeConvenantService: AllEmployeeCovenantService,
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
    notes!: string;
    showFormNew: boolean = false;
    sortField: string = 'id';
    sortOrder: string = 'asc';
    currentId: number;
    courseName!: string;
    date!: Date;
    cost!: number;
    hrApproved: boolean = false;
    stockVacation: boolean = false;
    dropdownItemsCovenantType!: any;

    // for all employees customize
    dropdownItemsEmployee: any;
    selectedEmployee: any;
    selectedEmployeeEdit: any;

    selectedCovenantType!: number;
    selectedCovenant!: any;
    selectedCovenantEdit!: any;

    addNewForm!: FormGroup;
    editForm!: FormGroup;

    serialNumber: any;
    items: any;

    ngOnInit() {
        this.endPoint = 'EmployeeCovenant';

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.employeeConvenantService.setCulture(mainLang);

            // update endpoint
            this.employeeConvenantService.setEndPoint(this.endPoint);

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

            this.getCovenantTypes();
            this.getDropDownEmployee();

            this.initFormGroups();

            // update breadcrumb
            this.translate.onLangChange.subscribe(() => {
                this.updateTranslations();
            });

            this.updateTranslations();
        });

    }

    initFormGroups() {
        this.addNewForm = new FormGroup({
            covenantId: new FormControl('', Validators.required),
            employeeId: new FormControl('', Validators.required),
            date: new FormControl('', Validators.required),

            cost: new FormControl('', Validators.required),
            serialNumber: new FormControl('', Validators.required),
            notes: new FormControl(''),
        });

        this.editForm = new FormGroup({
            id: new FormControl('', Validators.required),
            covenantId: new FormControl('', Validators.required),
            employeeId: new FormControl('', Validators.required),
            date: new FormControl('', Validators.required),

            cost: new FormControl('', Validators.required),
            serialNumber: new FormControl('', Validators.required),
            notes: new FormControl(''),
        });
    }

    editProduct(rowData: any) {
        console.log(rowData.id);
        rowData.date = this.convertDate(rowData.date, 'MM/dd/yyyy');
        this.loading = true;
        this.employeeConvenantService.GetById(rowData.id).subscribe({
            next: (res) => {
                this.loading = false;

                console.log('edit here data');
                console.log(res.data);

                this.product = { ...res.data };
                this.productDialog = true;

                this.selectedCovenantEdit = this.dropdownItemsCovenantType.find(
                    (item: any) => item.id == this.product.covenantId
                );

                this.selectedEmployeeEdit = this.dropdownItemsEmployee.find(
                    (item: any) => item.id == this.product.employeeId
                );

                console.log('selectedCovenantEdit => ');
                console.log(this.selectedCovenantEdit);

                console.log('dropdownItemsEmployee => ');
                console.log(this.dropdownItemsEmployee);

                this.product.date = this.convertDate(this.product.date, 'MM/dd/yyyy');
                console.log(this.product.date);

            },

            error: () => {
                this.loading = false;
                this.hideDialog();
            }
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
        this.employeeConvenantService.DeleteRange([id]).subscribe({
            next: () => {
                // hide loading
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

    addNew() {
        // first convert from date full format to time only
        // why? because prime ng calender component returned the value as a full Date Format

        this.addNewForm.patchValue({
            covenantId: this.selectedCovenant?.id,
            employeeId: this.selectedEmployee?.id,
        })

        if (this.addNewForm.valid) {
            // Confirm add new
            this.employeeConvenantService
                .Register(this.addNewForm.value)
                .subscribe({
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

                        this.addNewForm.clearValidators();
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

    setFieldsNulls() {
        this.selectedCovenantType = null;
        this.date = null;
        this.cost = null;
        this.notes = null;
        this.selectedCovenant = null;
        this.selectedEmployee = null;
        this.selectedEmployeeEdit = null;
    }

    loadData(
        page: number,
        size: number,
        nameFilter: string,
        filterType: string,
        sortType: string
    ) {
        let filteredData = {
            PageNumber: page,
            PageSize: size,
            FilterValue: nameFilter,
            FilterType: filterType,
            SortType: sortType,
        };
        filteredData.SortType = this.sortOrder;

        this.loading = true;

        // map to form data
        let bodyFormData = this.mapToFormData(filteredData)

        // get page from form data
        this.employeeConvenantService.GetPage(bodyFormData).subscribe({
            next: (res) => {
                console.log(res);
                this.allData = res.data;
                console.log(res.data);

                this.totalItems = res.totalItems;
                this.loading = false;
                console.log(this.selectedItems);
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

    saveProduct(product: any) {
        this.submitted = true;

        this.editForm.patchValue({
            id: product.id,
        });

        console.clear();
        console.log(this.editForm.value)

        if (this.editForm.valid) {
            this.employeeConvenantService.Edit(this.editForm.value).subscribe({
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

        this.employeeConvenantService.DeleteRange(selectedIds).subscribe({
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
    convertDate(date: any, format: string) {
        return this.DatePipe.transform(date, format);
    }
    getCovenantTypes() {
        this.employeeConvenantService.getDropdownField('Covenant').subscribe({
            next: (res) => {
                console.log(res);
                this.dropdownItemsCovenantType = res.data;
                console.log(this.dropdownItemsCovenantType);
            },
        });
    }

    getDropDownEmployee() {
        this.employeeConvenantService.getDropdownField('Employee').subscribe({
            next: (res) => {
                console.log(res);
                this.dropdownItemsEmployee = res.data;
                console.log(this.dropdownItemsEmployee);
            },
        });
    }
    selectCovenant(event: any) {
        console.log(event);
        this.selectedCovenantType = event.value.id;
        this.selectedCovenant = event.value;
    }

    selectedCovenantEditFun(event: any) {
        this.selectedCovenantEdit = event.value;
    }
}
