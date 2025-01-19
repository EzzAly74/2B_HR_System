import { isDevMode, NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { AppLayoutModule } from './layout/app.layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import {
    provideHttpClient,
    HttpClientModule,
    withInterceptors,
    HttpClient,
    HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { authInterceptor } from './demo/components/auth/auth.interceptor';
import {
    TranslateModule,
    TranslateLoader,
    TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PaginationModule } from './demo/components/pages/pagination/pagination.module';
import { environment } from 'src/environments/environment.prod';
import { ErrorHandlerInterceptor } from './demo/components/auth/error-handler.interceptor';
import { ToastModule } from 'primeng/toast';
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    console.log('environment Production App Module ');
    console.log(environment.production);
    if (!isDevMode())
        return new TranslateHttpLoader(
            http,
            '/2B_HR_System/assets/i18n/',
            '.json'
        );
    else return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        HttpClientModule,
        FormsModule,
        NgxPaginationModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        PaginationModule,
        HttpClientModule,
        ToastModule,
        ReactiveFormsModule,
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true },
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        ProductService,
        FormsModule,
        HttpClientModule,
        TranslateService,
        provideHttpClient(withInterceptors([authInterceptor])),
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
