import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Globals } from 'src/app/class/globals';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { ResignationSettingService } from './resignation-setting.service';

@Component({
  selector: 'app-resignation-setting',
  standalone: true,
  imports: [
    GlobalsModule,
    PrimeNgModule
  ],
  templateUrl: './resignation-setting.component.html',
  styleUrl: './resignation-setting.component.scss'
})
export class ResignationSettingComponent {
  
    // end point 
    @Input() endPoint!: string;
    resignForm: FormGroup = new FormGroup({
      noticePeriodInDays: new FormControl(null, [Validators.required]),
      resignationInstructions: this.fb.array([])
    });;
  

    constructor(
      private  _ResignationService: ResignationSettingService,
      private messageService: MessageService,
      private translate : TranslateService,
      private fb: FormBuilder,
    ) {}
  
    ngOnInit(): void {
      // Initialize form or load data if necessary
    }
  
    get items(): FormArray {
      return this.resignForm.get('items') as FormArray;
    }
  
    addItem(): void {
      this.items.push(this.fb.control(''));
    }
  
    removeItem(index: number): void {
      this.items.removeAt(index);
    }
  
    registerData(form: FormGroup): void {
      if (form.valid) {
        // Handle form submission logic here
        console.log('Form Data:', form.value);
        // Show success notification (e.g., using p-toast)
      } else {
        // Handle form validation errors
        console.error('Form is invalid');
      }
    }
}