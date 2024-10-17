import { CloseMonthComponent } from './components/custom/close-month/close-month.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DepartmentComponent } from './components/standard/department/department.component';
import { BankComponent } from './components/standard/bank/bank.component';
import { GovenmentComponent } from './components/standard/govenment/govenment.component';
import { LocationComponent } from './components/custom/location/location.component';
import { PartitionComponent } from './components/custom/partition/partition.component';
import { QualificationComponent } from './components/standard/qualification/qualification.component';
import { ShiftComponent } from './components/custom/shift/shift.component';
import { NotfoundComponent } from '../notfound/notfound.component';
import { authGuard } from '../auth/auth.guard';
import { PublicVacationComponent } from './components/custom/public-vacation/public-vacation.component';
import { ShiftVacationComponent } from './components/custom/shift-vacation/shift-vacation.component';
import { GradeComponent } from './components/standard/grade/grade.component';
import { JobComponent } from './components/standard/job/job.component';
import { RelativeRelationComponent } from './components/standard/relative-relation/relative-relation.component';
import { ContractTypeComponent } from './components/standard/contract-type/contract-type.component';
import { JobNatureComponent } from './components/standard/job-nature/job-nature.component';
import { RecuritmentSourceComponent } from './components/standard/recuritment-source/recuritment-source.component';
import { DocumentRequiredComponent } from './components/standard/document-required/document-required.component';
import { UniformCodesComponent } from './components/standard/uniform-codes/uniform-codes.component';
import { VacationSettingComponent } from './components/custom/vacation-setting/vacation-setting.component';
import { CovenantCategoryComponent } from './components/standard/covenant-category/covenant-category.component';
import { CovenantComponent } from './components/custom/covenant/covenant.component';
import { CompanyPolicyComponent } from './components/custom/company-policy/company-policy.component';
import { ExecuseTypeComponent } from './components/custom/execuse-type/execuse-type.component';
import { VacationTypeComponent } from './components/custom/vacation-type/vacation-type.component';
import { EmployeeDataComponent } from './components/employee-data/employee-data.component';
import { EmployeeEditComponent } from './components/employee-edit/employee-edit.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { AllEmployeesUniformComponent } from './components/custom/all-employees-uniform/all-employees-uniform.component';
import { AllEmployeesManagerComponent } from './components/custom/all-employees-manager/all-employees-manager.component';
import { AllEmployeesLocationComponent } from './components/custom/all-employees-location/all-employees-location.component';
import { AllEmployeesFileComponent } from './components/custom/all-employees-file/all-employees-file.component';
import { AllEmployeesCovenantComponent } from './components/custom/all-employees-covenant/all-employees-covenant.component';
import { UsersComponent } from './components/custom/users/users.component';
import { ExternalMissonComponent } from './components/custom/external-misson/external-misson.component';
import { VacationRequestComponent } from './components/custom/vacation-request/vacation-request.component';
import { ExecuseRequestComponent } from './components/custom/execuse-request/execuse-request.component';
import { InternalJobsComponent } from './components/custom/internal-jobs/internal-jobs.component';
import { AttendenceConfigurationComponent } from './components/custom/attendence-configuration/attendence-configuration.component';
import { AttendenceConfigEditComponent } from './components/custom/attendence-config-edit/attendence-config-edit.component';
import { TestInputComponentComponent } from './components/test-input-component/test-input-component.component';
import { SetEmployeeShiftsComponent } from './components/custom/set-employee-shifts/set-employee-shifts.component';
import { AllEmployeeFingerPrintsService } from './components/custom/all-employees-FingerPrints/all-employees-FingerPrints.service';
import { AllEmployeesFingerPrintComponent } from './components/custom/all-employees-FingerPrints/all-employees-FingerPrintscomponent';
import { KPIComponent } from './components/custom/kpi/kpi.component';
import { PenaltiesAndDeductionComponent } from './components/custom/penalties-and-deduction/penalties-and-deduction.component';
import { BonusComponent } from './components/custom/bonus/bonus.component';
import { TestComponent } from './components/employee-edit/AllTabs/test/test.component';
import { InternalJobsEditComponent } from './components/custom/internal-jobs-edit/internal-jobs-edit.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'department',
                canActivate: [authGuard],
                component: DepartmentComponent,
            },
            {
                path: 'bank',
                canActivate: [authGuard],
                component: BankComponent,
            },
            {
                path: 'government',
                canActivate: [authGuard],
                component: GovenmentComponent,
            },
            {
                path: 'grade',
                canActivate: [authGuard],
                component: GradeComponent,
            },
            {
                path: 'job',
                canActivate: [authGuard],
                component: JobComponent,
            },
            {
                path: 'location',
                canActivate: [authGuard],
                component: LocationComponent,
            },
            {
                path: 'partition',
                canActivate: [authGuard],
                component: PartitionComponent,
            },
            {
                path: 'qualification',
                canActivate: [authGuard],
                component: QualificationComponent,
            },
            {
                path: 'shift',
                canActivate: [authGuard],
                component: ShiftComponent,
            },
            {
                path: 'publicVacation',
                canActivate: [authGuard],
                component: PublicVacationComponent,
            },
            {
                path: 'shiftVacation',
                canActivate: [authGuard],
                component: ShiftVacationComponent,
            },
            {
                path: 'relativeRelation',
                canActivate: [authGuard],
                component: RelativeRelationComponent,
            },
            {
                path: 'contractType',
                canActivate: [authGuard],
                component: ContractTypeComponent,
            },
            {
                path: 'jobNature',
                canActivate: [authGuard],
                component: JobNatureComponent,
            },
            {
                path: 'recuritmentSource',
                canActivate: [authGuard],
                component: RecuritmentSourceComponent,
            },
            {
                path: 'documentRequired',
                canActivate: [authGuard],
                component: DocumentRequiredComponent,
            },
            {
                path: 'uniformCodes',
                canActivate: [authGuard],
                component: UniformCodesComponent,
            },
            {
                path: 'vacationSetting',
                canActivate: [authGuard],
                component: VacationSettingComponent,
            },
            {
                path: 'CovenantCategory',
                canActivate: [authGuard],
                component: CovenantCategoryComponent,
            },

            {
                path: 'Covenant',
                canActivate: [authGuard],
                component: CovenantComponent,
            },

            {
                path: 'companyPolicy',
                canActivate: [authGuard],
                component: CompanyPolicyComponent,
            },

            {
                path: 'execuseType',
                canActivate: [authGuard],
                component: ExecuseTypeComponent,
            },

            {
                path: 'closeMonth',
                canActivate: [authGuard],
                component: CloseMonthComponent,
            },
            {
                path: 'kpi',
                canActivate: [authGuard],
                component: KPIComponent,
            },
            {
                path: 'bonus',
                canActivate: [authGuard],
                component: BonusComponent,
            },
            {
                path: 'PenaltiesAndDeduction',
                canActivate: [authGuard],
                component: PenaltiesAndDeductionComponent,
            },

            {
                path: 'vacationType',
                canActivate: [authGuard],
                component: VacationTypeComponent,
            },
            {
                path: 'users',
                canActivate: [authGuard],
                component: UsersComponent,
            },
            {
                path: 'externalMisson',
                canActivate: [authGuard],
                component: ExternalMissonComponent,
            },
            {
                path: 'vacationRequest',
                canActivate: [authGuard],
                component: VacationRequestComponent,
            },
            {
                path: 'execuseRequest',
                canActivate: [authGuard],
                component: ExecuseRequestComponent,
            },
            {
                path: 'InternalJobs',
                canActivate: [authGuard],
                component: InternalJobsComponent,
            },
            {
                path: 'allEmployeesCovenant',
                canActivate: [authGuard],
                component: AllEmployeesCovenantComponent,
            },

            {
                path: 'allEmployeesFile',
                canActivate: [authGuard],
                component: AllEmployeesFileComponent,
            },

            {
                path: 'allEmployeesLocation',
                canActivate: [authGuard],
                component: AllEmployeesLocationComponent,
            },

            {
                path: 'allEmployeesManager',
                canActivate: [authGuard],
                component: AllEmployeesManagerComponent,
            },

            {
                path: 'allEmployeesUniform',
                canActivate: [authGuard],
                component: AllEmployeesUniformComponent,
            },

            {
                path: 'employees',
                canActivate: [authGuard],
                component: EmployeeDataComponent,
            },

            {
                path: 'employees/edit/:id',
                canActivate: [authGuard],
                pathMatch: 'prefix',
                component: EmployeeEditComponent,
                loadChildren: () =>
                    import(
                        './components/employee-edit/all-tabs-routing/all-tabs.module'
                    ).then((m) => m.AllTabsModule),
            },
            {
                path: 'InternalJobs/edit/:id',
                canActivate: [authGuard],
                pathMatch: 'prefix',
                component: InternalJobsEditComponent,
            },

            {
                path: 'employee',
                canActivate: [authGuard],
                component: EmployeeComponent,
            },
            {
                path: 'fingerprints',
                canActivate: [authGuard],
                component: AllEmployeesFingerPrintComponent,
            },
            {
                path: 'attendenceConfig',
                canActivate: [authGuard],
                component: AttendenceConfigurationComponent,
            },
            {
                path: 'attendenceConfig/edit/:id',
                canActivate: [authGuard],
                component: AttendenceConfigEditComponent,
            },

            {
                path: 'setEmployeeShifts',
                canActivate: [authGuard],
                component: SetEmployeeShiftsComponent,
            },

            {
                path: 'test',
                canActivate: [authGuard],
                component: TestComponent,
            },

            { path: '**', component: NotfoundComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class InfoRoutingModule {}
