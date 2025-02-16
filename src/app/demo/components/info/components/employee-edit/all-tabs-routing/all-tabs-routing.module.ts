import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeCertificationComponent } from './../AllTabs/employee-certification/employee-certification.component';
import { EmployeeCourseComponent } from '../AllTabs/employee-course/employee-course.component';
import { EmployeeCovenantComponent } from '../AllTabs/employee-covenant/employee-covenant.component';
import { EmployeeExperienceComponent } from '../AllTabs/employee-experience/employee-experience.component';
import { EmployeeFamilyComponent } from '../AllTabs/employee-family/employee-family.component';
import { EmployeeFileComponent } from '../AllTabs/employee-file/employee-file.component';
import { EmployeeLocationComponent } from '../AllTabs/employee-location/employee-location.component';
import { EmployeeManagerComponent } from '../AllTabs/employee-manager/employee-manager.component';
import { EmployeeSalaryComponent } from '../AllTabs/employee-salary/employee-salary.component';
import { EmployeeUniformComponent } from '../AllTabs/employee-uniform/employee-uniform.component';
import { EmployeeVacationStockComponent } from '../AllTabs/employee-vacation-stock/employee-vacation-stock.component';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeWeekendComponent } from '../AllTabs/employee-weekend/employee-weekend.component';
import { EmployeeShiftComponent } from '../AllTabs/employee-shift/employee-shift.component';
import { EmployeePartTimeSalaryComponent } from '../AllTabs/employee-part-time-salary/employee-part-time-salary.component';

const routes: Routes = [
    {
        path: 'EmployeeCertification',
        component: EmployeeCertificationComponent,
    },
    {
        path: 'EmployeeCourse',
        component: EmployeeCourseComponent,
    },
    {
        path: 'EmployeeCovenant',
        component: EmployeeCovenantComponent,
    },
    {
        path: 'EmployeeExperience',
        component: EmployeeExperienceComponent,
    },
    {
        path: 'EmployeeFamily',
        component: EmployeeFamilyComponent,
    },
    {
        path: 'EmployeeFile',
        component: EmployeeFileComponent,
    },
    {
        path: 'EmployeeLocation',
        component: EmployeeLocationComponent,
    },
    {
        path: 'EmployeeManager',
        component: EmployeeManagerComponent,
    },
    {
        path: 'EmployeeSalary',
        component: EmployeeSalaryComponent,
    },
    {
        path: 'EmployeeUniform',
        component: EmployeeUniformComponent,
    },
    {
        path: 'EmployeeVacationStock',
        component: EmployeeVacationStockComponent,
    },
    {
        path: 'EmployeeWeekend',
        component: EmployeeWeekendComponent,
    },
    {
        path: 'EmployeeShift',
        component: EmployeeShiftComponent,
    },
    {
        path: 'EmployeePartTimeSalary',
        component: EmployeePartTimeSalaryComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes), TranslateModule],
    exports: [RouterModule],
})
export class AllTabsRoutingModule { }
