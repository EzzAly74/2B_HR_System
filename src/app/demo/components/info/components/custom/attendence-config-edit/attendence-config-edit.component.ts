import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/class/globals';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AttendenceConfigurationService } from '../attendence-configuration/attendence-configuration.service';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';

@Component({
    selector: 'app-attendence-config-edit',
    standalone: true,
    imports: [
        GlobalsModule,
        PrimeNgModule,
    ],
    providers: [MessageService, DatePipe],
    templateUrl: './attendence-config-edit.component.html',
    styleUrl: './attendence-config-edit.component.scss',
})
export class AttendenceConfigEditComponent {
    constructor(
        private attendenceConfigurationService: AttendenceConfigurationService,
        private messageService: MessageService,
        private DatePipe: DatePipe,
        private router: Router,
        private route: ActivatedRoute,
        private activatedRoute: ActivatedRoute,
        private translate: TranslateService,
        private fb: FormBuilder
    ) {}
    @Input() endPoint!: string;
    @ViewChild('manageItems') manageItems: ElementRef;
    allData: any = [];
    page: number = 1;
    itemsPerPage = 4;
    selectedItems: any = [];
    cols: any[] = [];
    totalItems: any;
    loading: boolean = true;
    nameFilter: string;
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
    selectedState: any = null;
    selectedGovernment!: any;
    selectedNationalId: any = null;
    selectedPartitions: any = null;
    selectedGender: any = null;
    selectedMaritalStatus: any = null;
    selectedQualification: any = null;
    selectedJob: any = null;
    selectedReligin: any = null;
    selectedShift: any = null;
    selectedBank: any = null;
    selectedGrade: any = null;
    selectedjobNature: any = null;
    selectedRecuritmentSource: any = null;
    selectedContactType: any = null;
    selectedIsInsured: any = null;
    selectedIsManager: any = null;
    selectedDepartment: any = null;
    selectedBloodType: any = null;
    filterData!: FormGroup;
    uploadImageDialog: boolean = false;
    file!: File;
    // => dropdown Arrays

    // = Enums
    dropdownItemsReligin: any;
    dropdownItemsMaritalStatus: any;
    dropdownItemsBloodTypes: any;
    dropdownItemsGender: any;

    // = dropdowns
    dropdownItemsGovernment: any;
    dropdownItemsQualification: any;
    dropdownItemsJob: any;
    dropdownItemsDepartment: any;
    dropdownItemsPartition: any;
    dropdownItemsShift: any;
    dropdownItemsBank: any;
    dropdownItemsGrade: any;
    dropdownItemsJobNature: any;
    dropdownItemsRecuritmentSource: any;
    dropdownItemsContractType: any;
    imageUrl!: string;

    uploadedFiles: any[] = [];

    currentId!: number;
    birthDate!: any;
    joinInDate!: any;
    hiringData!: any;
    resignationDate!: any;
    address!: string;
    discription!: string;
    email!: string;
    englishName!: string;
    nameAr!: string;
    machineCode!: any;
    nationalId!: any;
    phone!: any;
    calculateLateAttendanceInTime: boolean;
    calculateLateAttendancePerMonth: boolean;
    includeDaysOffBetweenTwoAbsentDays: boolean;
    firstMissingFingerprint: number;
    secondMissingFingerprint: number;
    thirdMissingFingerprint: number;
    fourthMissingFingerprint: number;
    fifthMissingFingerprint: number;

    firstDayPenaltyDeduction: number;
    secondDayPenaltyDeduction: number;
    thirdDayPenaltyDeduction: number;
    fourthDayPenaltyDeduction: number;
    fifthAndAboveDayPenaltyDeduction: number;
    maxMissingFingerPrintWithoutDeduction: number;
    maxMonthlyLateMinutes: number;
    maxNumberOfExcusesPerMonth: number;
    maxExuseDurationInMinutes: number;
    selectedexcuseCalculationType: any = null;
    dropdownItemsexcuseCalculationType!: any;

    editForm: FormGroup = new FormGroup({
        Id: new FormControl({ value: this.currentId, disabled: true }),
        calculateLateAttendanceInTime: new FormControl(),
        calculateLateAttendancePerMonth: new FormControl(),
        includeDaysOffBetweenTwoAbsentDays: new FormControl(),
        firstMissingFingerprint: new FormControl(),
        secondMissingFingerprint: new FormControl(),
        thirdMissingFingerprint: new FormControl(),
        fourthMissingFingerprint: new FormControl(),
        fifthMissingFingerprint: new FormControl(),

        firstDayPenaltyDeduction: new FormControl(),
        secondDayPenaltyDeduction: new FormControl(),
        thirdDayPenaltyDeduction: new FormControl(),
        fourthDayPenaltyDeduction: new FormControl(),
        fifthAndAboveDayPenaltyDeduction: new FormControl(),

        maxMissingFingerPrintWithoutDeduction: new FormControl(),
        maxMonthlyLateMinutes: new FormControl(),
        maxNumberOfExcusesPerMonth: new FormControl(),
        maxExuseDurationInMinutes: new FormControl(),

        lateSettingsList: this.fb.array([]),
        excuseCalculationType: new FormControl(),
        nameAr: new FormControl(),
        englishName: new FormControl(),
    });

    // Actions Tabs variable
    Actions: any[] = [];
    selectedAction?: any;

    ngOnInit() {
        this.currentId = this.route.snapshot.params['id'];
        this.endPoint = 'AttendanceConfiguration';

        // adding this Configurations in each Component Customized

        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);
            this.translate.use(mainLang);

            this.attendenceConfigurationService.setCulture(mainLang);
            this.attendenceConfigurationService.setEndPoint(this.endPoint);

            // update endpoint

            // then, load data again to lens on the changes of mainLang & endPoints Call
        });

        this.cols = [
            // basic data
            { field: 'name', header: 'Name' },
            { field: 'notes', header: 'Notes' },

            // Generic Fields
            { field: 'creationTime', header: 'creationTime' },
            { field: 'lastModificationTime', header: 'lastModificationTime' },
            { field: 'creatorName', header: 'creatorName' },
            { field: 'lastModifierName', header: 'lastModifierName' },
        ];
        this.getDropDown();
        this.getData()
            .pipe(
                tap((data) => {
                    this.allData = data.data;
                    this.patchFormValues(this.allData);

                    console.log('Data fetched:', this.allData);

                    // Perform any additional operations if needed
                    // ...
                }),
                map((data) => {
                    this.patchFormValues(this.allData);
                })
            )

            .subscribe(() => {
                this.patchFormValues(this.allData);
            });

        const transformedDates = {
            birthDate: this.DatePipe.transform(
                this.allData.birthDate,
                'MM/dd/yyyy'
            ),
            joinInDate: this.DatePipe.transform(
                this.allData.joininDate,
                'MM/dd/yyyy'
            ),
            hiringData: this.DatePipe.transform(
                this.allData.hirDate,
                'MM/dd/yyyy'
            ),
            resignationDate: this.DatePipe.transform(
                this.allData.resignationDate,
                'MM/dd/yyyy'
            ),
        };
        this.patchFormValues(this.allData);

        console.log('this.allData');
        console.log(this.allData);
    }

    getObject(id: number, dropdown: any[]) {
        console.log('getObject - dropdown =>', dropdown);

        if (dropdown) return dropdown.find((item: any) => item.id == id);
    }

    changeTab() {
        console.log(this.selectedAction);
        this.router.navigate([this.selectedAction.action], {
            relativeTo: this.route,
        });
    }

    patchFormValues(data: any, transformedDates?: any) {
        // console.clear();
        console.log('data => ', data);

        this.calculateLateAttendanceInTime = data.calculateLateAttendanceInTime;
        this.calculateLateAttendancePerMonth =
            data.calculateLateAttendancePerMonth;
        this.includeDaysOffBetweenTwoAbsentDays =
            data.includeDaysOffBetweenTwoAbsentDays;
        this.firstMissingFingerprint = data.firstMissingFingerprint;
        this.secondMissingFingerprint = data.secondMissingFingerprint;
        this.thirdMissingFingerprint = data.thirdMissingFingerprint;
        this.fourthMissingFingerprint = data.fourthMissingFingerprint;
        this.fifthMissingFingerprint = data.fifthMissingFingerprint;

        this.firstDayPenaltyDeduction = data.firstDayPenaltyDeduction;
        this.secondDayPenaltyDeduction = data.secondDayPenaltyDeduction;
        this.thirdDayPenaltyDeduction = data.thirdDayPenaltyDeduction;
        this.fourthDayPenaltyDeduction = data.fourthDayPenaltyDeduction;
        this.fifthAndAboveDayPenaltyDeduction =
            data.fifthAndAboveDayPenaltyDeduction;

        this.maxMissingFingerPrintWithoutDeduction =
            data.maxMissingFingerPrintWithoutDeduction;
        this.maxMonthlyLateMinutes = data.maxMonthlyLateMinutes;
        this.maxNumberOfExcusesPerMonth = data.maxNumberOfExcusesPerMonth;
        this.maxExuseDurationInMinutes = data.maxExuseDurationInMinutes;

        this.patchFormData(data.lateSettingsList);
        this.nameAr = data.nameAr;
        this.englishName = data.englishName;
        this.selectedexcuseCalculationType = this.getObject(
            data.excuseCalculationType,
            this.dropdownItemsexcuseCalculationType
        );
    }

    submitForm(formData: FormGroup) {
        formData.patchValue({
            excuseCalculationType: this.selectedexcuseCalculationType?.id,
        });
        this.editForm.get('Id').enable();

        console.log(formData.value);

        this.attendenceConfigurationService.Edit(formData.value).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Employee Edited Successfully',
                });
                console.log(res);
                this.editForm.get('Id').disable();
                // this.attendenceConfigurationService.GetById(this.currentId).subscribe({
                //     next: (res) => {
                //         this.allData = res.data;
                //         console.clear();
                //         console.log('allData : ');
                //         console.log(this.allData);
                // this.birthDate = this.DatePipe.transform(
                //     this.editForm.get('BirthDate').value,
                //     'MM/dd/yyyy'
                // );
                // this.selectedReligin = this.getObject(
                //     this.editForm.get('Religion').value,
                //     this.dropdownItemsReligin
                // );
                // this.selectedGovernment = this.getObject(
                //     this.editForm.get('GovernmentId').value,
                //     this.dropdownItemsGovernment
                // );
                // this.selectedMaritalStatus = this.getObject(
                //     this.editForm.get('MaritalStatus').value,
                //     this.dropdownItemsMaritalStatus
                // );

                // this.selectedBloodType = this.getObject(
                //     this.editForm.get('BloodTypes').value,
                //     this.dropdownItemsBloodTypes
                // );
                // this.selectedGender = this.getObject(
                //     this.editForm.get('Gender').value,
                //     this.dropdownItemsGender
                // );
                // this.selectedQualification = this.getObject(
                //     this.editForm.get('QualificationId').value,
                //     this.dropdownItemsQualification
                // );
                // this.selectedJob = this.getObject(
                //     this.editForm.get('JobId').value,
                //     this.dropdownItemsJob
                // );

                // this.selectedDepartment = this.getObject(
                //     this.editForm.get('DepartmentId').value,
                //     this.dropdownItemsDepartment
                // );
                // this.selectedPartitions = this.getObject(
                //     this.editForm.get('PartationId').value,
                //     this.dropdownItemsPartition
                // );
                // this.selectedShift = this.getObject(
                //     this.editForm.get('ShiftId').value,
                //     this.dropdownItemsShift
                // );
                // this.selectedBank = this.getObject(
                //     this.editForm.get('BankId').value,
                //     this.dropdownItemsBank
                // );
                // this.selectedGrade = this.getObject(
                //     this.editForm.get('GradeId').value,
                //     this.dropdownItemsGrade
                // );
                // this.selectedjobNature = this.getObject(
                //     this.editForm.get('JobNatureId').value,
                //     this.dropdownItemsJobNature
                // );
                // this.selectedIsInsured = this.selectedIsInsured;
                // this.selectedIsManager = this.selectedIsManager;

                // this.selectedRecuritmentSource = this.getObject(
                //     this.editForm.get('RecuritmentSourceId').value,
                //     this.dropdownItemsRecuritmentSource
                // );

                // this.selectedContactType = this.getObject(
                //     this.editForm.get('ContractTypeId').value,
                //     this.dropdownItemsContractType
                // );
                // this.joinInDate = this.DatePipe.transform(
                //     this.editForm.get('JoininDate').value,
                //     'MM/dd/yyyy'
                // );
                // this.hiringData = this.DatePipe.transform(
                //     this.editForm.get('HirDate').value,
                //     'MM/dd/yyyy'
                // );
                // this.resignationDate = this.DatePipe.transform(
                //     this.editForm.get('ResignationDate').value,
                //     'MM/dd/yyyy'
                // );
                // this.address = this.address;
                // this.nameAr = this.nameAr;
                // this.englishName = this.englishName;
                // this.discription = this.discription;
                // this.nationalId = this.nationalId;
                // this.phone = this.phone;
                // this.machineCode = this.machineCode;
                // this.email = this.email;
            },
           
        });
        console.log(formData.value);
    }
    onGovernmentChange(event: any): void {
        console.log(event);
    }
    getData(): Observable<any> {
        return this.attendenceConfigurationService.GetById(this.currentId);
    }

    onSelect(event: any) {
        console.log(event);
        this.file = event.currentFiles[0];

        console.log(this.file);
    }

    showUploadImgDialg() {
        this.uploadImageDialog = true;
    }
    hideDialog() {
        this.uploadImageDialog = false;
    }
    get lateSettingsList(): FormArray {
        return this.editForm.get('lateSettingsList') as FormArray;
    }

    createLateSettingGroup(setting: any): FormGroup {
        return this.fb.group({
            id: [setting.id],
            attendanceConfigurationId: [setting.attendanceConfigurationId],
            deductionFromMinutes: [
                setting.deductionFromMinutes,
                Validators.required,
            ],
            deductionToMinutes: [
                setting.deductionToMinutes,
                Validators.required,
            ],
            deductionFactor: [setting.deductionFactor, Validators.required],
            firstPenaltyInDays: [
                setting.firstPenaltyInDays,
                Validators.required,
            ],
            secondPenaltyInDays: [
                setting.secondPenaltyInDays,
                Validators.required,
            ],
            thirdPenaltyInDays: [
                setting.thirdPenaltyInDays,
                Validators.required,
            ],
            fourthPenaltyInDays: [
                setting.fourthPenaltyInDays,
                Validators.required,
            ],
            deductTheLatency: [setting.deductTheLatency],
            deductedTimeInMinutes: [
                setting.deductedTimeInMinutes,
                Validators.required,
            ],
            isDeductedFromTotalExcuses: [setting.isDeductedFromTotalExcuses],
            deductionInMoney: [setting.deductionInMoney, Validators.required],
            isPerformedOnlyOneTime: [setting.isPerformedOnlyOneTime],
        });
    }
    patchFormData(data: any): void {
        // Clear existing array
        this.lateSettingsList.clear();

        // Add new form groups based on the data
        data.forEach((setting: any) => {
            this.lateSettingsList.push(this.createLateSettingGroup(setting));
        });
    }

    createLateSettingGroupAdd(): FormGroup {
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
            // add all other fields for late settings
        });
    }
    addLateSetting() {
        const lateSettings = this.editForm.get('lateSettingsList') as FormArray;
        lateSettings.push(this.createLateSettingGroupAdd());
    }
    getDropDown() {
        this.attendenceConfigurationService
            .getDropdownEnum('getExcuseCalculationType')
            .subscribe({
                next: (res) => {
                    console.log(res);
                    this.dropdownItemsexcuseCalculationType = res.data;
                },
            });
    }
    removeLateSetting(index: number) {
        const lateSettings = this.editForm.get('lateSettingsList') as FormArray;
        lateSettings.removeAt(index);
    }
}
