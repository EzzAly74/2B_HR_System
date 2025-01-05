import {
    FormGroup,
    FormBuilder,
    Validators,
    FormArray,
    FormControl,
} from '@angular/forms';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { Globals } from 'src/app/class/globals';
import { ResignationPolicyService } from './resignation-policy.service';
@Component({
    selector: 'app-resignation-policy',
    standalone: true,
    providers: [MessageService],
    imports: [GlobalsModule, PrimeNgModule],
    templateUrl: './resignation-policy.component.html',
    styleUrl: './resignation-policy.component.scss',
})
export class ResignationPolicyComponent {
    loading: boolean = false;
    constructor(
        private messageService: MessageService,
        private resignationPolicyService: ResignationPolicyService,
        private fb: FormBuilder
    ) { }

    resignationSettingForm: FormGroup = new FormGroup({
        noticePeriodInDays: new FormControl(null, [Validators.required]),
        resignationInstructions: this.fb.array([]),
    });

    ngOnInit(): void {
        // this.addInstruction();
        // set endpoint on service

        this.loading = true
        this.resignationPolicyService.setEndPoint('ResignationSetting');
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.resignationPolicyService.setCulture(mainLang);

            // update endpoint
            this.resignationPolicyService.setEndPoint('ResignationSetting');

            // then, load data again to lens on the changes of mainLang & endPoints Call
            this.resignationPolicyService.GetAll().subscribe({
                next: (res) => {
                    let data = res.data;
                    console.log(data);

                    this.loading = false;
                    if (data) {
                        // Patch other form controls
                        this.resignationSettingForm.patchValue({
                            noticePeriodInDays: data.noticePeriodInDays || null,
                        });

                        // Populate resignationInstructions (FormArray)
                        const instructionsArray =
                            this.resignationSettingForm.get(
                                'resignationInstructions'
                            ) as FormArray;
                        instructionsArray.clear(); // Clear existing FormArray items if any

                        if (
                            data.resignationInstructions &&
                            Array.isArray(data.resignationInstructions)
                        ) {
                            data.resignationInstructions.forEach(
                                (instruction: any) => {
                                    instructionsArray.push(
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
                error: () => {
                    this.loading = false;
                },
            });
        });

        // use function get from custom service to get data;
        // this.resignationPolicyService.GetAll().subscribe({
        //     next: (res) => {
        //         let data = res.data;
        //         console.log(data);

        //         if (data) {
        //             // Patch other form controls
        //             this.resignationSettingForm.patchValue({
        //                 noticePeriodInDays: data.noticePeriodInDays || null,
        //             });

        //             // Populate resignationInstructions (FormArray)
        //             const instructionsArray = this.resignationSettingForm.get(
        //                 'resignationInstructions'
        //             ) as FormArray;
        //             instructionsArray.clear(); // Clear existing FormArray items if any

        //             if (
        //                 data.resignationInstructions &&
        //                 Array.isArray(data.resignationInstructions)
        //             ) {
        //                 data.resignationInstructions.forEach((instruction) => {
        //                     instructionsArray.push(
        //                         new FormGroup({
        //                             instructionArabic: new FormControl(
        //                                 instruction.instructionArabic || null,
        //                                 [Validators.required]
        //                             ),
        //                             instructionEnglish: new FormControl(
        //                                 instruction.instructionEnglish || null,
        //                                 [Validators.required]
        //                             ),
        //                         })
        //                     );
        //                 });
        //             }
        //         }
        //     },
        //     error: (err) => {
        //         console.log(err);
        //         // show an error msg here
        //     },
        // });
    }
    get resignationInstructions(): FormArray {
        return this.resignationSettingForm.get(
            'resignationInstructions'
        ) as FormArray;
    }
    onSubmit(form: FormGroup) {
        console.log(form);

        this.resignationPolicyService.Register(form.value).subscribe({
            next: (res) => {
                console.log(res);
                if (res.success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: res.message,
                        life: 3000,
                    });
                }
            },
            error: (err) => {
                console.log(err);
                // show an error msg here
            },
        });

        console.log(form.value);
    }

    addInstruction(): void {
        const instructionGroup = this.fb.group({
            instructionArabic: [null, Validators.required],
            instructionEnglish: [null, Validators.required],
        });
        this.resignationInstructions.push(instructionGroup);
    }
    removeInstruction(index: number): void {
        this.resignationInstructions.removeAt(index);
    }
}
