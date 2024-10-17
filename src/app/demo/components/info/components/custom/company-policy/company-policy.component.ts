import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';

import { MessageService } from 'primeng/api';

import { Table, TableModule } from 'primeng/table';

import { CompanyPolicyService } from './company-policy.service';
import { environment } from 'src/environments/environment';
import { Globals } from 'src/app/class/globals';
import { itemsPerPageGlobal } from 'src/main';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-company-policy',
    standalone: true,
    imports: [
        GlobalsModule,
        PrimeNgModule,
    ],
    providers: [MessageService, DatePipe],
    templateUrl: './company-policy.component.html',
    styleUrl: './company-policy.component.scss',
})
export class CompanyPolicyComponent {
    constructor(
        private companyPolicyService: CompanyPolicyService,
        private messageService: MessageService,
        private DatePipe: DatePipe,
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
    showFormNew: boolean = false;
    sortField: string = 'id';
    sortOrder: string = 'asc';
    currentId!: number;
    // custom variables

    enName: string;
    arName: string;
    notes: string;
    discreption: string;

    url: string;
    selectedShift: string;
    selectedShiftId: number;
    fileNew: File;
    fileEdit: File;
    selectedShiftEdit: string;
    selectedShiftIdEdit: number;
    oldDate: any;
    baseUrlFile: string;
    CompanyPolicyUrl: string;

    addNewForm:FormGroup = new FormGroup({
        EngName : new FormControl(null,[Validators.required]),
        Name : new FormControl(null,[Validators.required]),
        Notes : new FormControl(null),
        Discreption : new FormControl(null,[Validators.required]),
        File : new FormControl(null , [Validators.required]),
    });

    editForm:FormGroup = new FormGroup({
        EngName : new FormControl(null,[Validators.required]),
        Name : new FormControl(null,[Validators.required]),
        Notes : new FormControl(null),
        Discreption : new FormControl(null,[Validators.required]),
        File : new FormControl(null),
        Id : new FormControl(null)
    })

    ngOnInit() {
        this.endPoint = 'CompanyPolicy';
        this.baseUrlFile = environment.mediaUrl;
        this.companyPolicyService.setEndPoint(this.endPoint);

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.companyPolicyService.setCulture(mainLang);

            // update endpoint
            this.companyPolicyService.setEndPoint(this.endPoint);

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
            // custom fields
            { field: 'url', header: 'Url' },
            { field: 'discreption', header: 'Discreption' },
            { field: 'file', header: 'File' },
            { field: 'deletFIle', header: 'deletFIle' },

            // Generic Fields
            { field: 'creationTime', header: 'creationTime' },
            { field: 'lastModificationTime', header: 'lastModificationTime' },
            { field: 'creatorName', header: 'creatorName' },
            { field: 'lastModifierName', header: 'lastModifierName' },
        ];
    }

    editProduct(rowData: any) {
        console.log(rowData.id);
        this.companyPolicyService.GetById(rowData.id).subscribe({
            next: (res) => {
                console.log(res.data);
                this.currentId = res.data.id;

                this.product = { ...res.data };

                this.productDialog = true;

                // get product.shiftId
                // this.selectedShiftEdit = this.shiftDropDown.find(
                //     (shift: any) => this.product.shiftId == shift.id
                // );

                // get product.date
                this.oldDate = this.DatePipe.transform(
                    this.product.date,
                    'MM/dd/yyyy'
                );
                this.product.date = this.DatePipe.transform(
                    this.product.date,
                    'MM/dd/yyyy'
                );

                // console.log("product date")
                // console.log(this.product.date)

                // console.log("old date")
                // console.log(this.oldDate)
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    changedSelected() {
        this.selectedShiftId = this.selectedShift['id'];
    }

    changedSelectedEdit() {
        this.selectedShiftId = this.selectedShift['id'];
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

    confirmDelete(id: number) {
        let allIds = [id];
        // perform delete from sending request to api
        this.companyPolicyService.DeleteRange(allIds).subscribe({
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

    addNew(form : FormGroup) {
      form.patchValue({
        File : this.fileNew
      })
        const formData: FormData = new FormData();
        let body = form.value ;

        console.log(form);
        
        for (const key in body) {
            if (body.hasOwnProperty(key)) {
                formData.append(key, body[key]);
            }
        }

        this.companyPolicyService.Register(formData).subscribe({
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
               form.reset()

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
        this.enName = null;
        this.arName = null;
        this.notes = null;
        this.discreption = null;
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

        this.companyPolicyService.GetPage(filteredData).subscribe({
            next: (res) => {
                console.log(res);
                this.allData = res.data;
                console.log(res.data);

                this.totalItems = res.totalItems;
                this.loading = false;
                console.log(this.selectedItems);
            },
            error: (err) => {
                console.error(err);
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

    saveProduct(id: number,form:FormGroup) {
        // this.submitted = true;


        form.patchValue({
            Id : id ,
            File : this.fileEdit ?? null  
        })

        let body = form.value ;
        const formDataEdit: FormData = new FormData();

        for (const key in body) {
            if (body.hasOwnProperty(key)) {
                formDataEdit.append(key, body[key]);
            }
        }

        console.log('body here ');

        console.log(body);

        this.companyPolicyService.Edit(formDataEdit).subscribe({
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
            },
         
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
        link.download = `${this.endPoint}_` + new Date().getTime() + '.csv';
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
            keys
                .map((key) => {
                    if (key == 'shift') {
                        console.log(row['shiftName']);
                    }

                    return key == 'Shift' ? `"${row[key]}"` : `"${row[key]}"`;
                })
                .join(separator)
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

        this.companyPolicyService.DeleteRange(selectedIds).subscribe({
            next: (res) => {
                this.deleteProductsDialog = false;
                this.messageService.add({
                    severity: 'success',
                    summary: this.translate.instant('Success'),
                    detail: res.message,
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
    onFileSelect(event: any) {
        console.log(event);
        let file: any = event.currentFiles[0];
        
        if(file)
        {
        this.fileNew = file;
        this.addNewForm.patchValue({
            File: file
        });
        this.addNewForm.get('File')?.updateValueAndValidity();
        }
    }
    onFileSelectEdit(event: any)
    {

        console.log(event);
        let file: any = event.currentFiles[0];
        
        if(file)
        {
        this.fileEdit = file;
        console.log(this.product);
        
        this.editForm.patchValue({
            File: file
        });
        this.editForm.get('File')?.updateValueAndValidity();
        }
    }
}
