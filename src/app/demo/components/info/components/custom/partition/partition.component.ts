import { PartitionService } from './partition.service';
import { Component, Input, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Globals } from 'src/app/class/globals';
import { itemsPerPageGlobal } from 'src/main';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import {  TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-partition',
    templateUrl: './partition.component.html',
    styleUrl: './partition.component.scss',
    providers: [MessageService],
    standalone: true,
    imports: [
        GlobalsModule,
        PrimeNgModule
    ],
})
export class PartitionComponent {
    constructor(
        private _PartitionService: PartitionService,
        private messageService: MessageService , 
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
    departmentDropDown: any[] = [];
    selectedDepartment: any = null;
    selectedDepartmentId: number = -1;
    selectedEditsDepartment: any;

    addnewForm : FormGroup = new FormGroup(
        {
            departmentId : new FormControl(null,[Validators.required]),
            engName : new FormControl(null,[Validators.required]),
            name : new FormControl(null,[Validators.required]),
            notes : new FormControl(null),
        }
    );
    
    editForm : FormGroup = new FormGroup(
        {
            departmentId : new FormControl(null,[Validators.required]),
            engName : new FormControl(null,[Validators.required]),
            name : new FormControl(null,[Validators.required]),
            notes : new FormControl(null),
            id : new FormControl(null)
        }
    )

    ngOnInit() {
        this.endPoint = 'Partation';

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this._PartitionService.setCulture(mainLang);

            // update endpoint
            this._PartitionService.setEndPoint(this.endPoint);

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

            // Generic Fields
            { field: 'creationTime', header: 'creationTime' },
            { field: 'lastModificationTime', header: 'lastModificationTime' },
            { field: 'creatorName', header: 'creatorName' },
            { field: 'lastModifierName', header: 'lastModifierName' },
        ];

        // get all drop downs departments
        this.getDropDownDepartment();
    }

    getDartmentNameById(id: number) {
        console.log('id edited');
        console.log(id);
        let dept = this.departmentDropDown.find((dept) => dept.id == id);
        return dept;
    }

    editProduct(rowData: any) {
        console.log(rowData.id);
        this._PartitionService.GetById(rowData.id).subscribe({
            next: (res) => {
                console.log(res.data);
                this.product = { ...res.data };
                this.productDialog = true;
                this.selectedEditsDepartment = this.getDartmentNameById(
                    this.product.departmentId
                );
                console.log('dept name is ', this.selectedEditsDepartment);
            },
           
        });
    }

    changedSelected(event: any) {
        // if (!event.value) {
        //     this.selectedDepartment = null;
        //   }
        //   else
        //   {
        //       this.selectedDepartment = event.value ;
        // this.selectedDepartmentId = this.selectedDepartment.id;
        //   }

        //   console.log(this.selectedDepartment);
          
    }

    getDropDownDepartment() {
        this._PartitionService.getDropDown('Department').subscribe({
            next: (res: any) => {
                this.departmentDropDown = res.data;
            },
           
        });
    }
    
    confirmDelete(id: number) {
        // perform delete from sending request to api
        this._PartitionService.DeleteSoftById(id).subscribe({
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

    addNew(form:FormGroup) {
      
        




        
      

        this._PartitionService.Register(form.value).subscribe({
            next: (res) => 
                {

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
            (this.newNotes = null)
            // (this.selectedDepartment = null);
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

        this._PartitionService.GetPage(filteredData).subscribe({
            next: (res) => {
                console.log(res);
                this.allData = res.data;
                console.log(res.data);

                this.totalItems = res.totalItems;
                this.loading = false;
                console.log(this.selectedItems);
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
            id : id,
            departmentId: this.selectedEditsDepartment.id 
        });

        console.log(form.value);
        


        this._PartitionService.Edit(form.value).subscribe({
            next: (res) => {
                if(res.success)
                {
                this.hideDialog();
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
        console.log(this.selectedItems);
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

        this._PartitionService.DeleteRangeSoft(selectedIds).subscribe({
            next: (res) => {
                this.deleteProductsDialog = false;
                this.messageService.add({
                    severity: 'success',
                    summary: this.translate.instant('Success'),
                    detail:res.message,
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

    splitCamelCase(str: any) {
        return str
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .replace(/\s+/g, ' ')
            .split(' ')
            .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
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
