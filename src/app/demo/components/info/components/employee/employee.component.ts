import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { MessageService } from "primeng/api";
import { EmployeeService } from "./employee.service";
import { UploadEvent } from "primeng/fileupload";
import { Globals } from "src/app/class/globals";
import { TranslateService } from "@ngx-translate/core";
import { GlobalsModule } from "src/app/demo/modules/globals/globals.module";
import { PrimeNgModule } from "src/app/demo/modules/primg-ng/prime-ng.module";

@Component({
    selector: 'app-employee',
    standalone: true,
    imports: [
        GlobalsModule,
        PrimeNgModule,
    ],
    providers: [MessageService, DatePipe, TranslateService],
    templateUrl: './employee.component.html',
    styleUrl: './employee.component.scss',
})
export class EmployeeComponent {
    selectedAttendanceConfiguration: any;
    constructor(
        private _EmployeeService: EmployeeService,
        private messageService: MessageService,
        private DatePipe: DatePipe
    ) {}

    // selected Items
    selectedState: any = null;
    selectedGovernment: any = null;
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
    selectedMachineCode: any = null;
    selectedNameAr: any = null;
    selectedEnglishName: any = null;
    selectedAddress: any = null;
    selectedJoininDate: any = null;
    selectedHirDate: any = null;
    selectedResignationDate: any = null;
    selectedDiscription: any = null;
    selectedPhone: any = null;
    selectedEmail: any = null;
    selectedBirthDate: any = null;
    selectedDepartment: any = null;
    selectedBloodType: any = null;

    selectedIsInsured: boolean = false;
    selectedIsManager: boolean = false;
    selectedIsStaticShift:boolean = false;
    selectedIsStaticVacation:boolean = false ;


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
    dropdownItemsAttendanceConfiguration:any;
    file: File = null;
    endPoint: string;
    selectedDeleteImage: boolean = false;
    registerForm: FormData = new FormData();

    ngOnInit(): void {
        this.endPoint = 'Employee';

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this._EmployeeService.setCulture(mainLang);

            // update endpoint
            this._EmployeeService.setEndPoint(this.endPoint);

            // get All Drop Downs
            this.getAllDropDowns();
        });
    }

    getAllDropDowns() {
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

        // get Attendance Configuration Dropdown
        this.getDropDownField({
            field: 'dropdownItemsAttendanceConfiguration',
            enum: 'AttendanceConfiguration',
        });
    }

    getDropDownEnum(self: { field: any; enum: string }) {
        this._EmployeeService
            .getEnum(self.enum)
            .subscribe({
                next: (res) => {
                    this[self.field] = res.data;
                },
                error: (err) => {
                    // console.log(`error in ${self.field}`)
                    // console.log(err);
                },
            });
    }

    getDropDownField(self: { field: any; enum: string }) {
        this._EmployeeService.getDropdownField(self.enum).subscribe({
            next: (res) => {
                this[self.field] = res.data;
            },
            error: (err) => {
                // console.log(`error in ${self.field}`)
                // console.log(err);
            },
        });
    }

    onSelect(event: any) {
        console.log('event file');
        console.log(event);

        // assign file
        this.file = event.currentFiles[0];

        this.registerForm.append('File', this.file);

        console.log('File');
        console.log(this.file);

        this.messageService.add({
            severity: 'info',
            summary: 'File Uploaded',
            detail: '',
        });
    }

    uploadedFiles: any[] = [];

    onUpload(event: UploadEvent) {
        for (let file of event?.["files"]) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({
            severity: 'info',
            summary: 'File Uploaded',
            detail: '',
        });
    }

    registerSubmit() {
        this.registerForm = new FormData();

        // File
        this.registerForm.append('File', this.file);

        // Append string fields
        this.registerForm.append('NameAr', this.selectedNameAr); // 1
        this.registerForm.append('EnglishName', this.selectedEnglishName); // 2
        this.registerForm.append('Address', this.selectedAddress); // 3
        this.registerForm.append('Email', this.selectedEmail); // 4
        this.registerForm.append('NationalId', this.selectedNationalId); // 5
        this.registerForm.append('Phone', this.selectedPhone); // 6
        this.registerForm.append('MachineCode', this.selectedMachineCode); // 7
        this.registerForm.append('Discription', this.selectedDiscription); // 8

        // Append numeric fields
        this.registerForm.append('BloodTypes', this.selectedBloodType?.['id']); // 9
        this.registerForm.append(
            'GovernmentId',
            this.selectedGovernment?.['id']
        ); // 10
        this.registerForm.append(
            'QualificationId',
            this.selectedQualification?.['id']
        ); //11

        this.registerForm.append(
            'AttendanceConfigurationId',
            this.selectedAttendanceConfiguration?.['id']
        ); //12

        this.registerForm.append('Gender', this.selectedGender?.['id']); //12
        this.registerForm.append(
            'MaritalStatus',
            this.selectedMaritalStatus?.['id']
        ); // 13
        this.registerForm.append('JobId', this.selectedJob?.['id']); // 14
        this.registerForm.append('JobNatureId', this.selectedjobNature?.['id']); // 15
        this.registerForm.append(
            'DepartmentId',
            this.selectedDepartment?.['id']
        ); // 16
        this.registerForm.append(
            'PartationId',
            this.selectedPartitions?.['id']
        ); // 17
        this.registerForm.append('ShiftId', this.selectedShift?.['id']); // 18
        this.registerForm.append('BankId', this.selectedBank?.['id']); // 19
        this.registerForm.append('GradeId', this.selectedGrade?.['id']); // 20
        this.registerForm.append(
            'ContractTypeId',
            this.selectedContactType?.['id']
        ); // 21
        this.registerForm.append(
            'RecuritmentSourceId',
            this.selectedRecuritmentSource?.['id']
        ); // 22
        this.registerForm.append('Religion', this.selectedReligin?.['id']); // 23

        // Append date fields
        this.registerForm.append(
            'JoininDate',
            this.DatePipe.transform(
                this.selectedJoininDate,
                'yyyy-MM-dd'
            )
        ); // 24

        this.registerForm.append(
            'BirthDate',
            this.DatePipe.transform(
                this.selectedBirthDate,
                'yyyy-MM-dd'
            )
        ); // 25

        this.registerForm.append(
            'HirDate',
            this.DatePipe.transform(this.selectedHirDate, 'yyyy-MM-dd')
        ); // 26

        this.registerForm.append(
            'ResignationDate',
            this.DatePipe.transform(
                this.selectedResignationDate,
                'yyyy-MM-dd'
            )
        ); // 27

        // Append boolean fields
        this.registerForm.append('Ismanger', this.selectedIsManager.toString()); // 28
        this.registerForm.append('StaticShift', this.selectedIsStaticShift.toString()); // 28
        this.registerForm.append('StaticVacation', this.selectedIsStaticVacation.toString()); // 28
        this.registerForm.append(
            'IsInsured',
            this.selectedIsInsured.toString()
        ); // 29

        this.registerForm.append(
            'DeleteImage',
            this.selectedDeleteImage.toString()
        ); // 30


        console.log("register form", this.registerForm)

        this._EmployeeService.Register(this.registerForm).subscribe({
            next: (res) => {
                console.log(res);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'item inserted successfully',
                    life: 3000,
                });
            },

            error: (err) => {
                console.error(err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Failure',
                    detail: err.statusText,
                    life: 3000,
                });
            },
        });
    }
}
