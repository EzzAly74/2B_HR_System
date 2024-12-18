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
 providers: [MessageService],
  templateUrl: './resignation-setting.component.html',
  styleUrl: './resignation-setting.component.scss'
})
export class ResignationSettingComponent {
  
  constructor(private fb: FormBuilder,
    private _ResignationSettingService: ResignationSettingService,
    private messageService: MessageService) {}

  resignationForm: FormGroup =  new FormGroup({
    noticePeriodInDays: new FormControl(null, Validators.required),
    resignationInstructions: this.fb.array([]),
  });

  resignData: any = {};

  endPoint = 'ResignationSetting';

  ngOnInit() {
    Globals.getMainLangChanges().subscribe((mainLang) => {
      console.log('Main language changed to:', mainLang);
      
      this._ResignationSettingService.setCulture(mainLang);
      
      this._ResignationSettingService.setEndPoint(this.endPoint);
      
      this.getResignDate();
    });
  }

  getResignDate() {
    this._ResignationSettingService.getData().subscribe({
      next: (res) => {
        let data = res.data;
        console.log(data);

        if (data) {
            // Patch other form controls
            this.resignationForm.patchValue({
                noticePeriodInDays: data.noticePeriodInDays || null,
            });

            // this.resignationInstructionsArray.clear(); // Clear existing FormArray items if any

            if (
                data.resignationInstructions &&
                Array.isArray(data.resignationInstructions)
            ) {
                data.resignationInstructions.forEach(
                    (instruction: any) => {
                        this.resignationInstructionsArray.push(
                            new FormGroup({
                                instructionArabic: new FormControl(
                                    instruction.instructionArabic ||
                                        null,
                                    [Validators.required]
                                ),
                                instructionEnglish: new FormControl(
                                    instruction.instructionEnglish ||
                                        null,
                                    [Validators.required]
                                ),
                            })
                        );
                    }
                );
            }
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  
  get resignationInstructionsArray(): FormArray {
    return this.resignationForm.get('resignationInstructions') as FormArray;
  }

  addInstruction(): void {
    const instructionGroup = this.fb.group({
        instructionArabic: [null, Validators.required],
        instructionEnglish: [null, Validators.required],
    });
    this.resignationInstructionsArray.push(instructionGroup);
  }

  removeInstruction(index: number) {
    this.resignationInstructionsArray.removeAt(index);
  }

  registerData(resignData: FormGroup) {
    if (resignData.valid) {
      this._ResignationSettingService.register(resignData.value).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
            life: 3000,
          });
        },
      });
    }
  }

}
