import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeTableModule } from 'primeng/treetable';
import { FormLayoutDemoRoutingModule } from '../../components/uikit/formlayout/formlayoutdemo-routing.module';
import { CheckboxModule } from 'primeng/checkbox';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  exports: [
    ToolbarModule,
    TableModule,
    RippleModule,
    FileUploadModule,
    HttpClientModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
    RadioButtonModule,
    PanelModule,
    TreeTableModule,
    CalendarModule,
    ChipsModule,
    MultiSelectModule,
    FormLayoutDemoRoutingModule,
    CheckboxModule,
    BadgeModule,
    ProgressBarModule,
    InputSwitchModule,
    RouterModule,
    FormsModule,
    ProgressBarModule,
    ConfirmDialogModule,
    TooltipModule
  ]
})
export class PrimeNgModule { }
