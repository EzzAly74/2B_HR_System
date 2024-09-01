import { CommonModule, DatePipe, Time } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Globals } from 'src/app/class/globals';
import { ActivatedRoute, Data } from '@angular/router';
import { EmployeeCourseService } from './employee-course.service';

@Component({
  selector: 'app-employee-course',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    ToolbarModule,
    TableModule,
    RippleModule,
    FileUploadModule,
    HttpClientModule,
    ButtonModule,
    FormsModule,
    DialogModule,
    ToastModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    ReactiveFormsModule,
    CalendarModule,
    TranslateModule,
    InputSwitchModule,
],
providers: [MessageService , DatePipe],

  templateUrl: './employee-course.component.html',
  styleUrl: './employee-course.component.scss'
})
export class EmployeeCourseComponent {
  constructor(
    private employeeCourseService: EmployeeCourseService,
    private messageService: MessageService ,
    private route: ActivatedRoute , 
    private DatePipe: DatePipe,

) {}

@ViewChild('dt') dt: Table;
@Input() endPoint!: string;
allData: any = [];
page: number = 1;
itemsPerPage = 10;
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
discription!: string;
showFormNew: boolean = false;
sortField: string = 'id';
sortOrder: string = 'asc';
currentId !: number ;
courseName!: string;
dateFrom!: Date;
dateTo!: Date;
location!: string;
hrApproved: boolean = false;
stockVacation: boolean = false;

ngOnInit() {
    this.endPoint = 'EmployeeCourse';
    this.route.parent?.paramMap.subscribe(params => {
      this.currentId  = Number(params.get('id'));
      console.log('currentId:', this.currentId); 
  });

      

    // adding this Configurations in each Component Customized
    Globals.getMainLangChanges().subscribe((mainLang) => {
        console.log('Main language changed to:', mainLang);

        // update mainLang at Service
        this.employeeCourseService.setCulture(mainLang);

        // update endpoint
        this.employeeCourseService.setEndPoint(this.endPoint);

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
}

editProduct(rowData: any) {
    console.log(rowData.id);
    rowData.dateFrom = this.convertDate(rowData.dateFrom,'MM/dd/yyyy');
    rowData.dateTo = this.convertDate(rowData.dateTo,'MM/dd/yyyy');
    this.employeeCourseService.GetById(rowData.id).subscribe({
        next: (res) => {
            console.log(res.data);
            res.data.dateFrom = this.convertDate(res.data.dateFrom,'MM/dd/yyyy');
            res.data.dateTo = this.convertDate(res.data.dateTo,'MM/dd/yyyy');
            console.log( res.data.dateFrom);
            console.log( res.data.dateTo);
            
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

startAttendeesTimeClick(event: any) {}

endAttendeesTimeClick(event: any) {}

confirmDelete(id: number) {
    // perform delete from sending request to api
    this.employeeCourseService.DeleteRange([id]).subscribe({
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
        courseName: this.courseName,
        employeeId: this.currentId,
        dateFrom: this.convertDate(this.dateFrom , "yyyy-MM-ddTHH:mm:ss"),
        dateTo: this.convertDate(this.dateTo,"yyyy-MM-ddTHH:mm:ss"),
        location: this.location,
        discription: this.discription,
    };

    console.log(body);

    // Confirm add new
    this.employeeCourseService.Register(body).subscribe({
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
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err,
                life: 3000,
            });
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
  this.courseName = null 
 this.dateFrom = null 
 this.dateTo = null 
 this.location = null 
  this.discription = null 

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
        pageNumber: page,
        pageSize: size,
        filterValue: nameFilter,
        filterType: filterType,
        sortType: sortType,
        employeeId:  this.currentId

    };
    filteredData.sortType = this.sortOrder;

    this.employeeCourseService.GetPage(filteredData).subscribe({
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
      courseName: product.courseName,
      employeeId: this.currentId,
      dateFrom: this.convertDate(product.dateFrom, "yyyy-MM-ddTHH:mm:ss"),
      dateTo: this.convertDate(product.dateTo, "yyyy-MM-ddTHH:mm:ss"),
      location: product.location,
      discription: product.discription,
      id: product.id
  };

    this.employeeCourseService.Edit(body).subscribe({
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

    this.employeeCourseService.DeleteRange(selectedIds).subscribe({
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
convertDate(date:any , format:string)
{
 return this.DatePipe.transform(date,format)
}

}



