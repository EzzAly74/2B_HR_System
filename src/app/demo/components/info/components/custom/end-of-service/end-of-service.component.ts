import { Component, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { EndOfServiceService } from './end-of-service.service';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Globals } from 'src/app/class/globals';

@Component({
  selector: 'app-end-of-service',
  standalone: true,
  imports: [GlobalsModule, PrimeNgModule],
  providers: [MessageService],
  templateUrl: './end-of-service.component.html',
  styleUrl: './end-of-service.component.scss'
})
export class EndOfServiceComponent {
  constructor(
    private _EndOfServiceService: EndOfServiceService,
    private messageService: MessageService,
    private translate: TranslateService
  ) { }

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

  fileNew!: File;

  addNewForm: FormGroup = new FormGroup({ // Initializing FormGroup using new FormGroup
    level: new FormControl('', Validators.required), // Level field is required
    rangeFrom: new FormControl('', [Validators.required, Validators.min(0)]), // Required and must be >= 0
    rangeTo: new FormControl('', [Validators.required, Validators.min(0)]), // Required and must be >= 0
    amountPerMonth: new FormControl('', [Validators.required, Validators.min(0)]), // Required and must be >= 0
    monthForYear: new FormControl(false), // Boolean field defaulting to false
    bouns: new FormControl('', [Validators.required, Validators.min(0)]), // Required and must be >= 0
    unUsedVacations: new FormControl('', [Validators.required, Validators.min(0)]), // Required and must be >= 0
  });

  editForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    level: new FormControl('', Validators.required), // Level field is required
    rangeFrom: new FormControl('', [Validators.required, Validators.min(0)]), // Required and must be >= 0
    rangeTo: new FormControl('', [Validators.required, Validators.min(0)]), // Required and must be >= 0
    amountPerMonth: new FormControl('', [Validators.required, Validators.min(0)]), // Required and must be >= 0
    monthForYear: new FormControl(false), // Boolean field defaulting to false
    bouns: new FormControl('', [Validators.required, Validators.min(0)]), // Required and must be >= 0
    unUsedVacations: new FormControl('', [Validators.required, Validators.min(0)]), // Required and must be >= 0
  });

  ngOnInit() {
    // adding this Configurations in each Component Customized
    Globals.getMainLangChanges().subscribe((mainLang) => {
      console.log('Main language changed to:', mainLang);

      this.endPoint = "EndOfService"
      // update mainLang at Service
      this._EndOfServiceService.setCulture(mainLang);

      // update endpoint
      this._EndOfServiceService.setEndPoint(this.endPoint);

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
    this._EndOfServiceService.GetById(rowData.id).subscribe({
      next: (res) => {
        console.log(res.data);
        this.product = { ...res.data };
        this.productDialog = true;
        console.clear();
        console.log("edit form value")
        console.log(this.editForm.value)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  confirmDelete(id: number) {
    // perform delete from sending request to api
    this._EndOfServiceService.deleteById(id).subscribe({
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

    this._EndOfServiceService.Register(form.value).subscribe({
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
      pageNumber: page,
      pageSize: size,
      filterValue: nameFilter,
      filterType: filterType,
      sortType: sortType,
    };
    filteredData.sortType = this.sortOrder;

    this._EndOfServiceService.GetPage(filteredData).subscribe({
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

  saveProduct(form: FormGroup, product: any) {
    this.submitted = true;

    form.patchValue({
      id: product.id,
    });

    // let body = {
    //     engName: product.engName,
    //     name: product.name,
    //     id: product.id,
    //     notes: product.notes,
    // };

    this.loading = true;

    this._EndOfServiceService.Edit(form.value).subscribe({
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
      }
    });
  }

  toggleNew() {
    if (this.showFormNew) {
      this.showFormNew = false;
      this.addNewForm.reset();
    } else {
      this.showFormNew = true;
      this.addNewForm.reset();
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
  confirmDeleteSelected() {
    let selectedIds = [];
    console.log('Selected Items :');

    this.selectedItems.forEach((item: any) => {
      selectedIds.push(item.id);
    });

    this.loading = true;

    this._EndOfServiceService.DeleteRangeSoft(selectedIds).subscribe({
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

  onFileSelect(event: any, fileUploader: any) {
    console.log(event);
    let file = event.files[0]; // Use `event.files` to get the uploaded file

    if (file) {
      this.fileNew = file;

      const formData: FormData = new FormData();
      formData.append('file', this.fileNew);

      this._EndOfServiceService.importExcel(formData).subscribe({
        next: (res) => {
          console.log(res);
          console.log('Upload successful');

          // Reload data
          this.loadData(
            this.page,
            this.itemsPerPage,
            this.nameFilter,
            this.sortField,
            this.sortOrder
          );

          // Show success message
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('Success'),
            detail: res?.['message'],
            life: 3000,
          });

          // Clear the file uploader
          fileUploader.clear();
        },
        error: (err) => {
          console.error(err);

          // Show error message
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('Error'),
            detail: this.translate.instant('UploadFailed'),
            life: 3000,
          });
        }
      });
    }
  }

}
