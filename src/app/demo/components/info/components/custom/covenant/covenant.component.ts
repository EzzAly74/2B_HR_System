import { Component, Input, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CovenantService } from './covenant.service';
import { Globals } from 'src/app/class/globals';
import { TranslateService } from '@ngx-translate/core';
import { itemsPerPageGlobal } from 'src/main';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-covenant',
    templateUrl: './covenant.component.html',
    styleUrl: './covenant.component.scss',
    standalone: true,
    imports: [
        GlobalsModule,
        PrimeNgModule,
    ],
    providers: [MessageService, TranslateService],
})
export class CovenantComponent {
    constructor(
        private _CovenantService: CovenantService,
        private messageService: MessageService,
        private translate : TranslateService
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
    newName!: string;
    newNotes!: string;
    showFormNew: boolean = false;
    sortField: string = 'id';
    sortOrder: string = 'asc';
    newNameAr!: string;
    newNameEn!: string;
    CovenantCategoryDropDown: any;
    CovenantCategoryIdSelected: any;
    selectedCovenantCategory: any;
    selectedCovenantCategoryOnEdit: any;

    selectedItemsData: any;
    addNewForm:FormGroup = new FormGroup({
        covenantCategoryId : new FormControl(null,[Validators.required]),
        engName : new FormControl(null,[Validators.required]),
        name : new FormControl(null,[Validators.required]),
        notes : new FormControl(null),
    });

    editForm:FormGroup = new FormGroup({
        covenantCategoryId : new FormControl(null,[Validators.required]),
        engName : new FormControl(null,[Validators.required]),
        name : new FormControl(null,[Validators.required]),
        notes : new FormControl(null),
        id : new FormControl(null)
    })

    ngOnInit() {
        this.endPoint = 'Covenant';

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this._CovenantService.setCulture(mainLang);

            // update endpoint
            this._CovenantService.setEndPoint(this.endPoint);

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
            // basic fields
            { field: 'name', header: 'Name' },
            { field: 'notes', header: 'Notes' },

            // custom fields
            { field: 'category', header: 'Category' },

            // Generic Fields
            { field: 'creationTime', header: 'CreationTime' },
            { field: 'lastModificationTime', header: 'LastModificationTime' },
            { field: 'creatorName', header: 'CreatorName' },
            { field: 'lastModifierName', header: 'LastModifierName' },
        ];

        // get drop down of CovenantCategory
        this.getDropDown('CovenantCategory');
    }

    getDropDown(field: string) {
        this._CovenantService.getDropDown(field).subscribe({
            next: (res: any) => {
                console.log(res.data);
                this.CovenantCategoryDropDown = res.data;
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

    changeCovenantCategory() {
        this.CovenantCategoryIdSelected = this.selectedCovenantCategory.id;
    }

    editProduct(rowData: any) {
        console.log(rowData.id);
        this._CovenantService.GetById(rowData.id).subscribe({
            next: (res) => {
                console.log(res.data);
                this.product = { ...res.data };
                this.productDialog = true;
                this.selectedCovenantCategoryOnEdit =
                    this.CovenantCategoryDropDown.find(
                        (cat: any) => this.product.covenantCategoryId == cat.id
                    );
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    confirmDelete(id: number) {
        // perform delete from sending request to api
        this._CovenantService.DeleteSoftById(id).subscribe({
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
            error: (err) => {
                console.log(err);
            },
        });
    }

    addNew(form:FormGroup) {

        console.log(form.value);
        
       
        this._CovenantService.Register(form.value).subscribe({
            next: (res) => {
                console.log(res);
                this.showFormNew = false;
                // show message for success inserted
                if(res.success)
                {
                this.messageService.add({
                    severity: 'success',
                    summary: this.translate.instant('Success'),
                    detail: res.message,
                    life: 3000,
                });
            }

                // set fields is empty
                form.reset() ;

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
            this.page,
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
            (this.CovenantCategoryIdSelected = null),
            (this.selectedCovenantCategory = null);
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

        this._CovenantService.GetPage(filteredData).subscribe({
            next: (res) => {
                console.log(res);
                this.allData = res.data;
                console.log(res.data);
                this.totalItems = res.totalItems;
                this.loading = false;

                this.selectedItemsData = this.allData;
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

    saveProduct(id: number, form:FormGroup) {
        this.submitted = true;
        console.log(id);
        form.patchValue({
            id : id,
            covenantCategoryId: this.selectedCovenantCategoryOnEdit.id 
        });
       console.log(form.value);
       
        this._CovenantService.Edit(form.value).subscribe({
            next: (res) => {
                this.hideDialog();
                // show message for user to show processing of deletion.
                if(res.success)
                {
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
            }
        });
    }

    toggleNew() {
        if (this.showFormNew) {
            this.showFormNew = false;
        } else {
            this.showFormNew = true;
            this.setFieldsNulls();
        }
    }

    exportCSV() {
        // Convert data to CSV format
        const csvData = this.convertToCSV(this.selectedItemsData);

        // Adding UTF-8 BOM
        const bom = '\uFEFF';
        const csvContent = bom + csvData;

        // Create a Blob with UTF-8 encoding
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        link.id = `${this.endPoint}_${new Date().getTime()}`;
        link.href = URL.createObjectURL(blob);
        link.download = `${this.endPoint}_${new Date().getTime()}.csv`;
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

        this._CovenantService.DeleteRangeSoft(selectedIds).subscribe({
            next: (res) => {
                this.deleteProductsDialog = false;
                this.messageService.add({
                    severity: 'success',
                    summary: this.translate.instant('Success'),
                    detail: res.message,
                    life: 3000,
                });
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
