import { LoanDetailsService } from './loan-details.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';

@Component({
    selector: 'app-loan-details',
    standalone: true,
    imports: [GlobalsModule, PrimeNgModule],
    providers: [MessageService],
    templateUrl: './loan-details.component.html',
    styleUrl: './loan-details.component.scss',
})
export class LoanDetailsComponent {
    allData!: any;
    constructor(
        private route: ActivatedRoute,
        private loanDetailsService: LoanDetailsService
    ) {}
    currentId!: number;
    ngOnInit() {
        this.currentId = this.route.snapshot.params['id'];
        this.getDetails();
    }

    getDetails() {
        this.loanDetailsService.getLoanDetails(this.currentId).subscribe({
            next: (res) => {
                console.log(res.data);
                this.allData = res.data;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
}
