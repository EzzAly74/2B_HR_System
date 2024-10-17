import { AttendenceConfigurationService } from './attendence-configuration.service';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormArray,
} from '@angular/forms';
import { Component, Input, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Globals } from 'src/app/class/globals';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
@Component({
    selector: 'app-attendence-configuration',
    standalone: true,

    imports: [
        GlobalsModule,
        PrimeNgModule,
    ],

    providers: [MessageService],
    templateUrl: './attendence-configuration.component.html',
    styleUrl: './attendence-configuration.component.scss',
})
export class AttendenceConfigurationComponent {
    constructor(
        private messageService: MessageService,
        private attendenceConfigurationService: AttendenceConfigurationService,
        private fb: FormBuilder,
        private router: Router
    ) {}

    @ViewChild('dt') dt: Table;
    @Input() endPoint!: string;
    allData: any = [];
    page: number = 1;
    itemsPerPage = 3;
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
    newNameAr!: string;
    newNameEn!: string;
    newNotes!: string;
    showFormNew: boolean = false;
    sortField: string = 'id';
    sortOrder: string = 'asc';
    attendanceForm: FormGroup;
    valCheck: boolean = false;
    execuseCalculationTypes!: any;
    selectedExecuseCalculationType!: any;
    selectedExecuseCalculationTypeId!: number;

    ngOnInit() {
        this.endPoint = 'AttendanceConfiguration';

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'notes', header: 'Notes' },
        ];
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.attendenceConfigurationService.setCulture(mainLang);

            // update endpoint
            this.attendenceConfigurationService.setEndPoint(this.endPoint);

            // then, load data again to lens on the changes of mainLang & endPoints Call
            this.loadData(
                this.page,
                this.itemsPerPage,
                this.nameFilter,
                this.sortField,
                this.sortOrder
            );
        });
        this.attendanceForm = this.fb.group({
            includeDaysOffBetweenTwoAbsentDays: [false, Validators.required],
            nameAr: ['', Validators.required],
            englishName: ['', Validators.required],
            firstDayPenaltyDeduction: [0, Validators.required],
            secondDayPenaltyDeduction: [0, Validators.required],
            thirdDayPenaltyDeduction: [0, Validators.required],
            fourthDayPenaltyDeduction: [0, Validators.required],
            fifthAndAboveDayPenaltyDeduction: [0, Validators.required],
            calculateLateAttendanceInTime: [false, Validators.required],
            calculateLateAttendancePerMonth: [false, Validators.required],
            excuseCalculationType: [null, Validators.required],
            maxMonthlyLateMinutes: [0, Validators.required],
            maxExuseDurationInMinutes: [0, Validators.required],
            maxNumberOfExcusesPerMonth: [0, Validators.required],
            firstMissingFingerprint: [0, Validators.required],
            secondMissingFingerprint: [0, Validators.required],
            thirdMissingFingerprint: [0, Validators.required],
            fourthMissingFingerprint: [0, Validators.required],
            fifthMissingFingerprint: [0, Validators.required],
            lateSettingsList: this.fb.array([this.createLateSettingGroup()]),
        });
        this.getExecuseCalculationTypesDropdown();

        console.log(this.execuseCalculationTypes);
    }
    createLateSettingGroup(): FormGroup {
        return this.fb.group({
            deductionFromMinutes: [0, Validators.required],
            deductionToMinutes: [0, Validators.required],
            deductionFactor: [0, Validators.required],
            deductedTimeInMinutes: [0, Validators.required],
            firstPenaltyInDays: [0, Validators.required],
            secondPenaltyInDays: [0, Validators.required],
            thirdPenaltyInDays: [0, Validators.required],
            fourthPenaltyInDays: [0, Validators.required],
            deductTheLatency: [false, Validators.required],
            isDeductedFromTotalExcuses: [false, Validators.required],
            isPerformedOnlyOneTime: [false, Validators.required],
            deductionInMoney: [0, Validators.required],
        });
    }
    addLateSetting() {
        const lateSettings = this.attendanceForm.get(
            'lateSettingsList'
        ) as FormArray;
        lateSettings.push(this.createLateSettingGroup());
    }

    // Remove a late setting entry
    removeLateSetting(index: number) {
        const lateSettings = this.attendanceForm.get(
            'lateSettingsList'
        ) as FormArray;
        lateSettings.removeAt(index);
    }

    editProduct(rowData: any) {
        this.product = { ...rowData };
        this.router.navigate(['/info/attendenceConfig/edit', rowData.id]);

        console.log(rowData);
    }

    confirmDelete(id: number) {
        // perform delete from sending request to api
        this.attendenceConfigurationService.deleteById(id).subscribe({
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
        console.log('Form Data:', form);
        if (form.valid) {
            form.patchValue({
                excuseCalculationType: this.selectedExecuseCalculationType?.id,
            });
            console.log('Form Data:', form);

            this.attendenceConfigurationService.Register(form.value).subscribe({
                next: (res) => {
                    console.log(res);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'You Added an Item Successfully',
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
            (this.newNotes = null);
    }

    loadData(
        page: number,
        size: number,
        nameFilter: string,
        filterType: string,
        sortType: string = 'asc'
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

        this.attendenceConfigurationService.GetPage(filteredData).subscribe({
            next: (res) => {
                console.log(res);
                this.allData = res.data;
                console.log(res.data);

                this.totalItems = res.totalItems;
                this.loading = false;
                // this.selectedItems = this.allData;
                console.log(this.selectedItems);

                console.log(sortType);
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

    deleteProduct(product: any, event: any) {
        this.deleteProductDialog = true;
        this.product = { ...product };
        event.stopPropagation();
    }

    saveProduct(id: number, product: any) {
        this.submitted = true;
        console.log(id);
        console.log(product);

        let body = {
            id: product.id,
            name: product.name,
            notes: product.notes,
        };

        this.attendenceConfigurationService.Edit(body).subscribe({
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

        this.attendenceConfigurationService
            .DeleteRangeSoft(selectedIds)
            .subscribe({
                next: (res) => {
                    this.deleteProductsDialog = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'items deleted successfully',
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
    getExecuseCalculationTypesDropdown() {
        this.attendenceConfigurationService
            .getDropdownEnum('getExcuseCalculationType')
            .subscribe({
                next: (res) => {
                    console.log(res);
                    this.execuseCalculationTypes = res.data;
                },
             
            });
    }
    selectedExecuseCalculationTypeFun(event: any) {
        this.selectedExecuseCalculationType = event.value;
        this.selectedExecuseCalculationTypeId = event.value.id;
    }
}
