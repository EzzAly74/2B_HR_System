import { environment } from './../../../../../../environments/environment';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/class/globals';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeEditService } from './employee-edit.service';
import { map, Observable, tap } from 'rxjs';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
@Component({
    selector: 'app-employee-edit',
    standalone: true,
    imports: [
        GlobalsModule,
        PrimeNgModule,
    ],
    providers: [
        MessageService,
        DatePipe,
        TranslateService,
        ConfirmationService,
    ],
    templateUrl: './employee-edit.component.html',
    styleUrl: './employee-edit.component.scss',
})
export class EmployeeEditComponent {
    constructor(
        private employeeEditService: EmployeeEditService,
        private messageService: MessageService,
        private DatePipe: DatePipe,
        private router: Router,
        private route: ActivatedRoute,
        private activatedRoute: ActivatedRoute,
        private translate: TranslateService,
        private confirmationService: ConfirmationService
    ) { }


    @ViewChild('dt') dt: Table;
    @Input() endPoint!: string;
    @ViewChild('manageItems') manageItems: ElementRef;
    allData: any = [];
    page: number = 1;
    itemsPerPage = 4;
    selectedItems: any = [];
    cols: any[] = [];
    totalItems: any;
    loading: boolean = false;
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
    selectedStaticShift: any = false;
    selectedStaticVacation: any = false;
    selectedDepartment: any = null;
    selectedBloodType: any = null;
    selectedAttendanceConfiguration: any = null;

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
    dropdownItemsAttendanceConfiguration: any;
    imageUrl!: string;

    uploadedFiles: any[] = [];

    currentId!: number;
    birthDate!: any;
    joiningDate!: any;
    hiringDate!: any;
    resignationDate!: any;
    address!: string;
    discription!: string;
    email!: string;
    englishName!: string;
    nameAr!: string;
    machineCode!: any;
    nationalId!: any;
    phone!: any;
    baseImgUrl: string = environment.mediaUrl;
    editForm: FormGroup = new FormGroup({
        BirthDate: new FormControl(null, Validators.required),
        BloodTypes: new FormControl(null),
        DepartmentId: new FormControl(null, Validators.required),
        Gender: new FormControl(null, Validators.required),
        GovernmentId: new FormControl(null, Validators.required),
        HiringDate: new FormControl(null, Validators.required),
        JobId: new FormControl(null, Validators.required),
        JoiningDate: new FormControl(null, Validators.required),
        MaritalStatus: new FormControl(null, Validators.required),
        PartationId: new FormControl(null, Validators.required),
        QualificationId: new FormControl(null, Validators.required),
        ShiftId: new FormControl(null, Validators.required),
        ResignationDate: new FormControl(null),
        Ismanger: new FormControl(false),
        IsInsured: new FormControl(false),
        Religion: new FormControl(null),
        BankId: new FormControl(null),
        GradeId: new FormControl(null),
        JobNatureId: new FormControl(null),
        RecuritmentSourceId: new FormControl(null),
        ContractTypeId: new FormControl(null),
        Address: new FormControl(null, Validators.required),
        Discription: new FormControl(null),
        Email: new FormControl(null),
        EnglishName: new FormControl(null),
        NameAr: new FormControl(null, Validators.required),
        MachineCode: new FormControl(null),
        NationalId: new FormControl(null, Validators.required),
        Phone: new FormControl(null, Validators.required),
        StaticShift: new FormControl(false),
        StaticVacation: new FormControl(false),
        AttendanceConfigurationId: new FormControl(null, Validators.required),
    });


    // Actions Tabs variable
    Actions: any[] = [];
    @Input() selectedAction?: any;

    ngOnInit() {
        this.currentId = this.route.snapshot.params['id'];

        this.endPoint = 'Employee';

        // adding this Configurations in each Component Customized

        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);
            this.translate.use(mainLang);

            this.employeeEditService.setCulture(mainLang);
            this.Actions = [
                {
                    id: 1,
                    name: 'Employee Certificates',
                    action: 'EmployeeCertification',
                },
                {
                    id: 2,
                    name: this.translate.instant('Employee Course'),
                    action: 'EmployeeCourse',
                },
                {
                    id: 3,
                    name: this.translate.instant('Employee Covenent'),
                    action: 'EmployeeCovenant',
                },
                {
                    id: 4,
                    name: this.translate.instant('Employee Experience'),
                    action: 'EmployeeExperience',
                },
                {
                    id: 5,
                    name: this.translate.instant('Employee Family'),
                    action: 'EmployeeFamily',
                },
                {
                    id: 6,
                    name: this.translate.instant('Employee File'),
                    action: 'EmployeeFile',
                },
                {
                    id: 7,
                    name: this.translate.instant('Employee Location'),
                    action: 'EmployeeLocation',
                },
                {
                    id: 8,
                    name: this.translate.instant('Employee Manager'),
                    action: 'EmployeeManager',
                },
                {
                    id: 9,
                    name: this.translate.instant('Employee Salary'),
                    action: 'EmployeeSalary',
                },
                {
                    id: 10,
                    name: this.translate.instant('Employee Uniform'),
                    action: 'EmployeeUniform',
                },
                {
                    id: 11,
                    name: this.translate.instant('Employee Vacation Stock'),
                    action: 'EmployeeVacationStock',
                },
                {
                    id: 12,
                    name: this.translate.instant('Employee Weekend'),
                    action: 'EmployeeWeekend',
                },
                {
                    id: 13,
                    name: this.translate.instant('Employee Shift'),
                    action: 'EmployeeShift',
                },
            ];

            // update endpoint
            this.employeeEditService.setEndPoint(this.endPoint);

            // then, load data again to lens on the changes of mainLang & endPoints Call
            this.getDropDownsData();
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
        this.getDropDownsData();

        this.loading = true;
        this.getData()
            .pipe(
                tap((data) => {
                    this.allData = data.data;
                    this.patchFormValues(this.allData, transformedDates);

                    console.log('Data fetched:', this.allData);

                    // Perform any additional operations if needed
                    // ...
                }),
                map((data) => {
                    // Compute transformedDates here
                    return {
                        birthDate: this.DatePipe.transform(
                            data.data.birthDate,
                            'MM/dd/yyyy'
                        ),
                        joiningDate: this.DatePipe.transform(
                            data.data.joiningDate,
                            'MM/dd/yyyy'
                        ),
                        hiringDate: this.DatePipe.transform(
                            data.data.hiringDate,
                            'MM/dd/yyyy'
                        ),
                        resignationDate: this.DatePipe.transform(
                            data.data.resignationDate,
                            'MM/dd/yyyy'
                        ),
                    };
                })
            )

            .subscribe({
                next: (transformedDates: any) => {
                    console.log('transformedDates');
                    console.log(transformedDates);
                    this.patchFormValues(this.allData, transformedDates);
                    this.loading = false
                },
                error: () => {
                    this.loading = false
                }
            });

        const transformedDates = {
            birthDate: this.DatePipe.transform(
                this.allData.birthDate,
                'MM/dd/yyyy'
            ),
            joiningDate: this.DatePipe.transform(
                this.allData.joiningDate,
                'MM/dd/yyyy'
            ),
            hiringDate: this.DatePipe.transform(
                this.allData.hiringDate,
                'MM/dd/yyyy'
            ),
            resignationDate: this.DatePipe.transform(
                this.allData.resignationDate,
                'MM/dd/yyyy'
            ),
        };
        this.patchFormValues(this.allData, transformedDates);

        this.Actions = [
            {
                id: 1,
                name: 'Employee Certificates',
                action: 'EmployeeCertification',
            },
            {
                id: 2,
                name: 'Employee Course',
                action: 'EmployeeCourse',
            },
            {
                id: 3,
                name: 'Employee Covenent',
                action: 'EmployeeCovenant',
            },
            {
                id: 4,
                name: 'Employee Experience',
                action: 'EmployeeExperience',
            },
            {
                id: 5,
                name: 'Employee Family',
                action: 'EmployeeFamily',
            },
            {
                id: 6,
                name: 'Employee File',
                action: 'EmployeeFile',
            },
            {
                id: 7,
                name: 'Employee Location',
                action: 'EmployeeLocation',
            },
            {
                id: 8,
                name: 'Employee Manager',
                action: 'EmployeeManager',
            },
            {
                id: 9,
                name: 'Employee Salary',
                action: 'EmployeeSalary',
            },
            {
                id: 10,
                name: 'Employee Uniform',
                action: 'EmployeeUniform',
            },
            {
                id: 11,
                name: 'Employee Vacation Stock',
                action: 'EmployeeVacationStock',
            },
            {
                id: 12,
                name: this.translate.instant('Employee Weekend'),
                action: 'EmployeeWeekend',
            },
            {
                id: 13,
                name: this.translate.instant('Employee Shift'),
                action: 'EmployeeShift',
            },
        ];

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

    ngOnChanges(changes: SimpleChanges) {
        if (changes["selectedAction"]) {
            console.clear();
            console.log('selectedAction changed:', this.selectedAction);
            this.selectedAction
        }
    }


    patchFormValues(data: any, transformedDates?: any) {
        // console.clear();
        console.log('data => ', data);

        if (data.imageUrl)
            this.imageUrl = `${this.baseImgUrl}/${data.imageUrl}`;

        this.selectedReligin = this.getObject(
            data.religion,
            this.dropdownItemsReligin
        );
        console.log('this.selectedReligin : ', this.selectedReligin);


        this.selectedGovernment = this.getObject(
            data.governmentId,
            this.dropdownItemsGovernment
        );
        console.log('this.selectedGovernment : ', this.selectedGovernment);

        this.selectedMaritalStatus = this.getObject(
            data.maritalStatus,
            this.dropdownItemsMaritalStatus
        );
        console.log(
            'this.selectedMaritalStatus : ',
            this.selectedMaritalStatus
        );

        this.selectedBloodType = this.getObject(
            data.bloodTypes,
            this.dropdownItemsBloodTypes
        );
        console.log('this.selectedBloodType : ', this.selectedBloodType);

        this.selectedGender = this.getObject(
            data.gender,
            this.dropdownItemsGender
        );
        console.log('this.selectedGender : ', this.selectedGender);

        this.selectedQualification = this.getObject(
            data.qualificationId,
            this.dropdownItemsQualification
        );
        console.log(
            'this.selectedQualification : ',
            this.selectedQualification
        );

        this.selectedAttendanceConfiguration = this.getObject(
            data.attendanceConfigurationId,
            this.dropdownItemsAttendanceConfiguration
        );
        console.log(
            'this.selectedAttendanceConfiguration : ',
            this.selectedAttendanceConfiguration
        );

        this.selectedJob = this.getObject(data.jobId, this.dropdownItemsJob);
        console.log('this.selectedJob : ', this.selectedJob);
        this.selectedDepartment = this.getObject(
            data.departmentId,
            this.dropdownItemsDepartment
        );
        console.log('this.selectedDepartment : ', this.selectedDepartment);

        this.selectedPartitions = this.getObject(
            data.partationId,
            this.dropdownItemsPartition
        );
        console.log('this.selectedPartitions : ', this.selectedPartitions);
        this.selectedShift = this.getObject(
            data.shiftId,
            this.dropdownItemsShift
        );

        console.log('this.selectedShift : ', this.selectedShift);

        this.selectedBank = this.getObject(data.bankId, this.dropdownItemsBank);
        console.log('this.selectedBank : ', this.selectedBank);

        this.selectedGrade = this.getObject(
            data.gradeId,
            this.dropdownItemsGrade
        );

        console.log('this.selectedGrade : ', this.selectedGrade);

        this.selectedjobNature = this.getObject(
            data.jobNatureId,
            this.dropdownItemsJobNature
        );
        console.log('this.selectedjobNature : ', this.selectedjobNature);

        this.selectedIsInsured = data.isInsured;
        this.selectedIsManager = data.ismanger;
        this.selectedStaticShift = data.staticShift;
        this.selectedStaticVacation = data.staticVacation;
        this.selectedRecuritmentSource = this.getObject(
            data.recuritmentSourceId,
            this.dropdownItemsRecuritmentSource
        );

        console.log(
            'this.selectedRecuritmentSource : ',
            this.selectedRecuritmentSource
        );

        this.selectedContactType = this.getObject(
            data.contractTypeId,
            this.dropdownItemsContractType
        );
        console.log('this.selectedContactType : ', this.selectedContactType);

        // Apply transformed dates
        this.birthDate = transformedDates.birthDate;
        this.joiningDate = transformedDates.joiningDate;
        this.hiringDate = transformedDates.hiringDate;
        this.resignationDate = transformedDates.resignationDate;

        // Set other data fields
        this.address = data.address;
        this.nameAr = data.nameAr;
        this.englishName = data.englishName;
        this.discription = data.discription;
        this.nationalId = data.nationalId;
        this.phone = data.phone;
        this.machineCode = data.machineCode;
        this.email = data.email;

        this.getData().subscribe({
            next: (res) => {
                this.allData = res.data;
                this.loading = false;
                this.patchFormValues(this.allData);
            },
            error: (err) => {
                this.loading = false;
            }
        });
    }

    getDropDownEnum(self: { field: any; enum: string }) {
        this.employeeEditService.getEnum(self.enum).subscribe({
            next: (res) => {
                this[self.field] = res.data;
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                console.log(`error in ${self.field}`);
                console.log(err);
            },
        });
    }

    getDropDownField(self: { field: any; enum: string }) {
        this.employeeEditService.getDropdownField(self.enum).subscribe({
            next: (res) => {
                this[self.field] = res.data;
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                console.log(`error in ${self.field}`);
                console.log(err);
            },
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

    submitForm(formData: FormGroup) {

        formData.patchValue({
            BloodTypes: this.selectedBloodType?.id,
            GovernmentId: this.selectedGovernment?.id,
            QualificationId: this.selectedQualification?.id,
            AttendanceConfigurationId: this.selectedAttendanceConfiguration?.id,
            Gender: this.selectedGender?.id,
            MaritalStatus: this.selectedMaritalStatus?.id,
            JobId: this.selectedJob?.id,
            JobNatureId: this.selectedjobNature?.id,
            DepartmentId: this.selectedDepartment?.id,
            PartationId: this.selectedPartitions?.id,
            ShiftId: this.selectedShift?.id,
            BankId: this.selectedBank?.id,
            GradeId: this.selectedGrade?.id,
            ContractTypeId: this.selectedContactType?.id,
            RecuritmentSourceId: this.selectedRecuritmentSource?.id,
            Religion: this.selectedReligin?.id,

            JoiningDate: this.DatePipe.transform(
                this.editForm.get('JoiningDate').value,
                'yyyy-MM-dd'
            ),

            BirthDate: this.DatePipe.transform(
                this.editForm.get('BirthDate').value,
                'yyyy-MM-dd'
            ),

            HiringDate: this.DatePipe.transform(
                this.editForm.get('HiringDate').value,
                'yyyy-MM-dd'
            ),

            ResignationDate: this.DatePipe.transform(
                this.editForm.get('ResignationDate').value,
                'yyyy-MM-dd'
            ),
        });
        // this.editForm.get('Id').enable();

        console.log(formData.value);

        this.loading = true;


        const bodyForm = {
            ...formData.value,
            Id: this.currentId,
        }

        const newFormData = this.mapToFormData(bodyForm)

        this.employeeEditService.Edit(newFormData).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Employee Edited Successfully',
                });
                console.log(res);
                this.loading = false;

                // this.editForm.get('Id').disable();
                // this.employeeEditService.GetById(this.currentId).subscribe({
                //     next: (res) => {
                //         this.allData = res.data;
                //         console.clear();
                //         console.log('allData : ');
                //         console.log(this.allData);
                this.birthDate = this.DatePipe.transform(
                    this.editForm.get('BirthDate').value,
                    'MM/dd/yyyy'
                );
                this.selectedReligin = this.getObject(
                    this.editForm.get('Religion').value,
                    this.dropdownItemsReligin
                );
                this.selectedGovernment = this.getObject(
                    this.editForm.get('GovernmentId').value,
                    this.dropdownItemsGovernment
                );
                this.selectedMaritalStatus = this.getObject(
                    this.editForm.get('MaritalStatus').value,
                    this.dropdownItemsMaritalStatus
                );

                this.selectedBloodType = this.getObject(
                    this.editForm.get('BloodTypes').value,
                    this.dropdownItemsBloodTypes
                );
                this.selectedGender = this.getObject(
                    this.editForm.get('Gender').value,
                    this.dropdownItemsGender
                );
                this.selectedQualification = this.getObject(
                    this.editForm.get('QualificationId').value,
                    this.dropdownItemsQualification
                );



                this.selectedJob = this.getObject(
                    this.editForm.get('JobId').value,
                    this.dropdownItemsJob
                );

                this.selectedDepartment = this.getObject(
                    this.editForm.get('DepartmentId').value,
                    this.dropdownItemsDepartment
                );
                this.selectedPartitions = this.getObject(
                    this.editForm.get('PartationId').value,
                    this.dropdownItemsPartition
                );
                this.selectedShift = this.getObject(
                    this.editForm.get('ShiftId').value,
                    this.dropdownItemsShift
                );
                this.selectedBank = this.getObject(
                    this.editForm.get('BankId').value,
                    this.dropdownItemsBank
                );
                this.selectedGrade = this.getObject(
                    this.editForm.get('GradeId').value,
                    this.dropdownItemsGrade
                );
                this.selectedjobNature = this.getObject(
                    this.editForm.get('JobNatureId').value,
                    this.dropdownItemsJobNature
                );
                this.selectedAttendanceConfiguration = this.getObject(
                    this.editForm.get('AttendanceConfigurationId').value,
                    this.dropdownItemsAttendanceConfiguration);

                this.selectedIsInsured = this.selectedIsInsured;
                this.selectedIsManager = this.selectedIsManager;
                this.selectedStaticShift = this.selectedStaticShift;
                this.selectedStaticVacation = this.selectedStaticVacation;

                this.selectedRecuritmentSource = this.getObject(
                    this.editForm.get('RecuritmentSourceId').value,
                    this.dropdownItemsRecuritmentSource
                );

                this.selectedContactType = this.getObject(
                    this.editForm.get('ContractTypeId').value,
                    this.dropdownItemsContractType
                );
                this.joiningDate = this.DatePipe.transform(
                    this.editForm.get('JoiningDate').value,
                    'MM/dd/yyyy'
                );
                this.hiringDate = this.DatePipe.transform(
                    this.editForm.get('HiringDate').value,
                    'MM/dd/yyyy'
                );
                this.resignationDate = this.DatePipe.transform(
                    this.editForm.get('ResignationDate').value,
                    'MM/dd/yyyy'
                );
                this.address = this.address;
                this.nameAr = this.nameAr;
                this.englishName = this.englishName;
                this.discription = this.discription;
                this.nationalId = this.nationalId;
                this.phone = this.phone;
                this.machineCode = this.machineCode;
                this.email = this.email;
            },
            error: (err) => {
                // this.editForm.get('Id').disable();
                console.log(err);
                this.loading = false;

            },
        });
        console.log(formData.value);
    }

    onGovernmentChange(event: any): void {
        console.log(event);
    }

    getData(): Observable<any> {
        // this.loading = true;
        this.employeeEditService.GetById(this.currentId).subscribe({
            next: (res) => {
                this.allData = res.data;

                this.loading = false;

                this.patchFormValues(this.allData);
            },
            error: () => {
                this.loading = false;
            }

        });
        return this.employeeEditService.GetById(this.currentId);
    }

    getDropDownsData() {
        // Enum ===>
        // get Blood Type Dropdown
        this.getDropDownEnum({
            field: 'dropdownItemsBloodTypes',
            enum: 'getBloodTypes',
        });

        // get Gender Dropdown
        this.getDropDownEnum({
            field: 'dropdownItemsGender',
            enum: 'getGender',
        });

        // get MaritalStatus Dropdown
        this.getDropDownEnum({
            field: 'dropdownItemsMaritalStatus',
            enum: 'getMaritalStatus',
        });

        // get Religion Dropdown
        this.getDropDownEnum({
            field: 'dropdownItemsReligin',
            enum: 'getReligion',
        });

        // ==========================================================================

        // get Dropdown ==>
        // get Blood Type Dropdown
        this.getDropDownEnum({
            field: 'dropdownItemsReligin',
            enum: 'getReligion',
        });

        // get Government Dropdown
        this.getDropDownField({
            field: 'dropdownItemsGovernment',
            enum: 'Government',
        });

        // get Qualification Dropdown
        this.getDropDownField({
            field: 'dropdownItemsQualification',
            enum: 'Qualification',
        });

        // get Attendance Configuration Dropdown
        this.getDropDownField({
            field: 'dropdownItemsAttendanceConfiguration',
            enum: 'AttendanceConfiguration',
        });

        // get Job Dropdown
        this.getDropDownField({ field: 'dropdownItemsJob', enum: 'Job' });

        // get Department Dropdown
        this.getDropDownField({
            field: 'dropdownItemsDepartment',
            enum: 'Department',
        });
        // get Attendance Configuration Dropdown
        this.getDropDownField({
            field: 'dropdownItemsAttendanceConfiguration',
            enum: 'AttendanceConfiguration',
        });

        // get Partition Dropdown
        this.getDropDownField({
            field: 'dropdownItemsPartition',
            enum: 'Partation',
        });

        // get Shift Dropdown
        this.getDropDownField({ field: 'dropdownItemsShift', enum: 'Shift' });

        // get Bank Dropdown
        this.getDropDownField({ field: 'dropdownItemsBank', enum: 'Bank' });

        // get Grade Dropdown
        this.getDropDownField({ field: 'dropdownItemsGrade', enum: 'Grade' });

        console.log('dropdownItemsGrade : ', this.dropdownItemsGrade);

        // get JobNature Dropdown
        this.getDropDownField({
            field: 'dropdownItemsJobNature',
            enum: 'JobNature',
        });

        // get RecuritmentSource Dropdown
        this.getDropDownField({
            field: 'dropdownItemsRecuritmentSource',
            enum: 'RecuritmentSource',
        });

        // get ContactTypes Dropdown
        this.getDropDownField({
            field: 'dropdownItemsContractType',
            enum: 'ContractType',
        });
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

    updateImage() {
        let body = {
            EmployeeId: this.currentId,
            File: this.file,
            DeleteImage: this.file ? true : false,
        };
        let formData: FormData = new FormData();
        for (const key in body) {
            if (body.hasOwnProperty(key)) {
                formData.append(key, body[key]);
            }
        }

        this.employeeEditService.updateEmployeeImage(formData).subscribe({
            next: (res) => {
                console.log(res);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successfull',
                    detail: 'Image Updated Sucessfully',
                });
                this.uploadImageDialog = false;
                this.file = null;
                this.loading = false;

                this.getData()
                    .pipe(
                        tap((data) => {
                            this.allData = data.data;
                            console.log('Data fetched:', this.allData);
                            this.patchFormValues(this.allData);

                            // Perform any additional operations if needed
                            // ...
                        }),
                        map((data) => {
                            // Compute transformedDates here
                            return {
                                birthDate: this.DatePipe.transform(
                                    data.data.birthDate,
                                    'MM/dd/yyyy'
                                ),
                                joiningDate: this.DatePipe.transform(
                                    data.data.joiningDate,
                                    'MM/dd/yyyy'
                                ),
                                hiringDate: this.DatePipe.transform(
                                    data.data.hiringDate,
                                    'MM/dd/yyyy'
                                ),
                                resignationDate: this.DatePipe.transform(
                                    data.data.resignationDate,
                                    'MM/dd/yyyy'
                                ),
                            };
                        })
                    )
                    .subscribe((transformedDates) => {
                        console.log('transformedDates');
                        console.log(transformedDates);

                        this.patchFormValues(this.allData, transformedDates);
                    });
            },
            error: (err) => {
                console.log(err);
                this.loading = false;
            },
        });
    }

    confirmDeleteImage(event: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                let body = {
                    EmployeeId: this.currentId,
                    DeleteImage: true,
                };
                let formData: FormData = new FormData();
                for (const key in body) {
                    if (body.hasOwnProperty(key)) {
                        formData.append(key, body[key]);
                    }
                }
                this.employeeEditService
                    .updateEmployeeImage(formData)
                    .subscribe({
                        next: (res) => {
                            console.log(res);
                            this.uploadImageDialog = false;
                            this.imageUrl = '';
                        },
                        error: (err) => {
                            console.log(err);
                        },
                    });
            },
        });
    }
}
