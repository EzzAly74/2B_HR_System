import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/class/globals';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { InternalJobService } from '../internal-jobs/internal-job.service';
import { CalendarModule } from 'primeng/calendar';
@Component({
  selector: 'app-internal-jobs-edit',
  standalone: true,
  imports: [  GlobalsModule,
    PrimeNgModule, CalendarModule , ReactiveFormsModule ],
    providers:[DatePipe, MessageService],
  templateUrl: './internal-jobs-edit.component.html',
  styleUrl: './internal-jobs-edit.component.scss'
})
export class InternalJobsEditComponent {
  currentId!:number ;
  status!:boolean ;
  

  editForm: FormGroup = new FormGroup({
    id: new FormControl({ value: this.currentId, disabled: true }),
    jobRequirements: this.fb.array([]),
    status: new FormControl(),
    description: new FormControl(null,[Validators.required]),
    nameOfJob: new FormControl(null,[Validators.required]),
    date: new FormControl(null,[Validators.required]),
    notes: new FormControl(null,[Validators.required]),
});


constructor(
  private internalJobService: InternalJobService,
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

birthDate!: any;
joinInDate!: any;
hiringData!: any;
resignationDate!: any;
address!: string;
discription!: string;
email!: string;
description!: string;
nameOfJob!: string;
machineCode!: any;
nationalId!: any;
phone!: any;
calculateLateAttendanceInTime: boolean;
calculateLateAttendancePerMonth: boolean;
includeDaysOffBetweenTwoAbsentDays: boolean;
firstMissingFingerprint: number;
notes: string;
date: any;
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


// Actions Tabs variable
Actions: any[] = [];
selectedAction?: any;

ngOnInit() {
    this.currentId = this.route.snapshot.params['id'];
    this.endPoint = 'InternalJob';

    // adding this Configurations in each Component Customized

    Globals.getMainLangChanges().subscribe((mainLang) => {
        console.log('Main language changed to:', mainLang);
        this.translate.use(mainLang);

        this.internalJobService.setCulture(mainLang);
        this.internalJobService.setEndPoint(this.endPoint);

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

    this.nameOfJob = data.nameOfJob ;
    this.description = data.description;
    this.notes = data.notes;
    this.date = this.DatePipe.transform(
      data.date,
      'MM/dd/yyyy hh:mm:ss a');
      this.status = data.status ? true : false;
    this.patchFormData(data.jobRequirements);

    console.log(this.status);
    

    
   
}

submitForm(formData: FormGroup) {
   
  formData.get('id').enable();

  formData.patchValue({
    status: formData.get('status').value ? 1 : 0 ,
    date: this.DatePipe.transform(formData.get('date').value , "yyyy-MM-ddTHH:mm:ss") 
  })

    console.log(formData);

    this.internalJobService.Edit(formData.value).subscribe({
        next: (res) => {
            this.messageService.add({
                severity: 'success',
                summary: this.translate.instant('Success'),
                detail:res.message
            });
            console.log(res);
            this.editForm.get('id').disable();
            // this.internalJobService.GetById(this.currentId).subscribe({
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

}
onGovernmentChange(event: any): void {
    console.log(event);
}
getData(): Observable<any> {
    return this.internalJobService.GetById(this.currentId);
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
get jobRequirements(): FormArray {
    return this.editForm.get('jobRequirements') as FormArray;
}

createLateSettingGroup(setting: any): FormGroup {
    return this.fb.group({
       requirement: [setting.requirement, Validators.required]
       
    });
}
patchFormData(data: any): void {
    // Clear existing array
    this.jobRequirements.clear();

    // Add new form groups based on the data
    data.forEach((setting: any) => {
        this.jobRequirements.push(this.createLateSettingGroup(setting));
    });
}

createLateSettingGroupAdd(): FormGroup {
    return this.fb.group({    
        requirement: [null, Validators.required],
        // add all other fields for late settings
    });
}
addLateSetting() {
    const jobRequirements = this.editForm.get('jobRequirements') as FormArray;
    jobRequirements.push(this.createLateSettingGroupAdd());
}

removeLateSetting(index: number) {
    const lateSettings = this.editForm.get('jobRequirements') as FormArray;
    lateSettings.removeAt(index);
}
}
