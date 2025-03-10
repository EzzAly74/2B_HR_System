import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { DayNamePipe } from '../shift-vacation/day-name.pipe';
import { ActivatedRoute } from '@angular/router';
import { itemsPerPageGlobal } from 'src/main';
import { Table } from 'primeng/table';
import { AllEmployeeVacationStockService } from './all-employee-vacation-stock.service';
import { Globals } from 'src/app/class/globals';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-all-employee-vacation-stock',
  standalone: true,
  imports: [GlobalsModule, PrimeNgModule],
  providers: [MessageService, DatePipe, DayNamePipe],
  templateUrl: './all-employee-vacation-stock.component.html',
  styleUrl: './all-employee-vacation-stock.component.scss'
})
export class AllEmployeeVacationStockComponent {
  constructor(
    private _EmployeeVacationStockService: AllEmployeeVacationStockService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private DatePipe: DatePipe,
    private translate: TranslateService
  ) { }

  @ViewChild('dt') dt: Table;
  id!: number;

  endPoint!: string;
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

  // custom
  VacationTypesDropDown: any;
  empId: number;

  // => for add new
  selectedStartDate: any;
  selectedVacationType: any;
  selectedVacationBalance: any;
  selectedYear: any;
  fileNew!: File;

  // for edit
  selectedStartDateEdit: any;
  selectedVacationTypeEdit: any;

  dropdownItemsEmployee: any;
  selectedEmployeeEdit!: any;


  vacationForm = new FormGroup({
    employeeId: new FormControl(null, Validators.required),
    vacationType: new FormControl(null, Validators.required),
    startDate: new FormControl(null, Validators.required),
    vacationBalance: new FormControl('', Validators.required),
    year: new FormControl('', Validators.required)
  });

  productForm = new FormGroup({
    employeeId: new FormControl(null, Validators.required),
    startDate: new FormControl(null, Validators.required),
    vacationType: new FormControl(null, Validators.required),
    vacationBalance: new FormControl('', Validators.required),
    year: new FormControl('', Validators.required)
  });

  ngOnInit() {


    this.endPoint = 'EmployeeVacationStock';

    this._EmployeeVacationStockService.setEndPoint(this.endPoint);

    Globals.getMainLangChanges().subscribe((mainLang) => {
      console.log('Main language changed to:', mainLang);

      // update mainLang at Service
      this._EmployeeVacationStockService.setCulture(mainLang);

      // get Dropdown Employees
      this.getDropDownEmployee();

      // update endpoint
      this._EmployeeVacationStockService.setEndPoint(this.endPoint);

      // then, load data again to lens on the changes of mainLang & endPoints Call
      this.loadData(
        this.page,
        this.itemsPerPage,
        this.nameFilter,
        this.sortField,
        this.sortOrder,
      );
    });

    this.cols = [
      // custom fields
      { field: 'start Date', header: 'Start Date' },
      { field: 'vacation Balance', header: 'Vacation Balance' },
      { field: 'vacation Type', header: 'Vacation Type' },
      { field: 'year', header: 'Year' },

      // Generic Fields
      { field: 'creationTime', header: 'CreationTime' },
      { field: 'lastModificationTime', header: 'LastModificationTime' },
      { field: 'creatorName', header: 'CreatorName' },
      { field: 'lastModifierName', header: 'LastModifierName' },
    ];

    // get Drop Down of Unifrom Codes
    this.getDropDown();
  }

  getDropDown() {
    this._EmployeeVacationStockService
      .getDropDownVacationStock('VacationType')
      .subscribe({
        next: (res) => {
          this.VacationTypesDropDown = res.data;
          console.log('Drop Down Unifrom Codes from here');
          console.log(res.data);
        },
        error: (err) => {
          console.log('Error in Unifrom Codes DropDown');
          console.error(err);
        },
      });
  }

  editProduct(rowData: any) {
    console.log(rowData.id);
    console.log('edit works');
    this._EmployeeVacationStockService.GetById(rowData.id).subscribe({
      next: (res) => {
        console.log(res.data);
        this.product = { ...res.data };
        this.productDialog = true;

        // get product.date
        this.selectedStartDateEdit = this.DatePipe.transform(
          this.product.startDate,
          'MM/dd/yyyy'
        );
        this.product.startDate = this.DatePipe.transform(
          this.product.startDate,
          'MM/dd/yyyy'
        );

        this.selectedVacationTypeEdit = this.VacationTypesDropDown.find(
          (code: any) => code.id == this.product.vacationTypeId
        );


        this.selectedEmployeeEdit = this.dropdownItemsEmployee.find(
          (emp: any) => emp.id == this.product.employeeId
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  confirmDelete(id: number) {
    let body = [id];

    // perform delete from sending request to api
    this._EmployeeVacationStockService.DeleteRange(body).subscribe({
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
          this.sortOrder,
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addNew(form: FormGroup) {
    // convert selected Date
    this.selectedStartDate = this.DatePipe.transform(
      this.selectedStartDate,
      'yyyy-MM-dd',
    );

    let body = {
      ...form.value,
    };

    this._EmployeeVacationStockService.Register(body).subscribe({
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
          this.sortOrder,
        );
      },
      error: (err) => {
        // this.showFormNew = false;

        console.log(err);
      },
    });
  }

  loadFilteredData() {
    this.loadData(
      this.page,
      this.itemsPerPage,
      this.nameFilter,
      this.sortField,
      this.sortOrder,
    );
  }


  onFileSelect(event: any, fileUploader: any) {
    console.log(event);
    let file = event.files[0]; // Use `event.files` to get the uploaded file

    if (file) {
      this.fileNew = file;

      const formData: FormData = new FormData();
      formData.append('file', this.fileNew);

      this._EmployeeVacationStockService.importExcel(formData).subscribe({
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


  setFieldsNulls() {
    this.selectedStartDate = null;
    this.selectedVacationType = null;
    this.vacationForm.reset();
  }

  loadData(
    page: number,
    size: number,
    nameFilter: string,
    filterType: string,
    sortType: string,
  ) {
    this.loading = true;
    let filteredData = {
      PageNumber: page,
      pageSize: size,
      FilterValue: nameFilter,
      FilterType: filterType,
      SortType: sortType,
      // EmployeeId: employeeId,
    };
    filteredData.SortType = this.sortOrder;

    console.log('FilteredData');
    console.log(filteredData);

    let newFormData: FormData = new FormData();
    for (const key in filteredData) {
      if (filteredData.hasOwnProperty(key)) {
        newFormData.append(key, filteredData[key]);
      }
    }

    this._EmployeeVacationStockService.GetPage(newFormData).subscribe({
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


  getDropDownEmployee() {
    this._EmployeeVacationStockService.getDropDown('Employee').subscribe({
      next: (res: any) => {
        this.dropdownItemsEmployee = res.data;
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
      this.sortOrder,
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

  saveProduct(form: FormGroup) {
    this.submitted = true;

    this.selectedStartDateEdit = this.DatePipe.transform(
      this.product.startDate,
      'yyyy-MM-dd'
    );

    this.product.startDate = this.DatePipe.transform(
      this.product.startDate,
      'yyyy-MM-dd'
    );

    console.log('selectedVacationTypeEdit');
    console.log(this.selectedVacationTypeEdit);

    let body = {
      employeeId: this.empId,
      startDate: this.product.startDate,
      vacationTypeId: this.selectedVacationTypeEdit?.['id'],
      vacationBalance: this.product.vacationBalance,
      year: this.product.year,
    };

    console.clear();
    console.log('body here for editing..........');

    console.log(body);

    this._EmployeeVacationStockService.Edit(body).subscribe({
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
          this.sortOrder,
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
      this.setFieldsNulls();
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

  splitCamelCase(str: any) {
    return str
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  confirmDeleteSelected() {
    let selectedIds = [];
    console.log('Selected Items :');

    this.selectedItems.forEach((item: any) => {
      selectedIds.push(item.id);
    });

    this._EmployeeVacationStockService.DeleteRange(selectedIds).subscribe({
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
          this.sortOrder,
        );
      },
      error: (err) => {
        this.deleteProductsDialog = false;
        this.loadData(
          this.page,
          this.itemsPerPage,
          this.nameFilter,
          this.sortField,
          this.sortOrder,
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
