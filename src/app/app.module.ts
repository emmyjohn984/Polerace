import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { MatMenuModule } from '@angular/material/menu';
import { ChartsModule } from 'ng2-charts';
import { TooltipModule } from 'primeng/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreServicesModule } from 'libs/core-services/src';
import { DashboardComponent } from './Platform/dashboard/components/dashboard.component';
import { MultiTranslateHttpLoader } from './auth/service/multi-translate-loader';
import { DashboardModule } from './Platform/dashboard/dashboard.module';
import { LanguageSelectorComponent } from './shared/language-selector/language-selector.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { MainComponent } from './shared/layout/main/main.component';
import { SvInterceptorService } from 'libs/core-services/src/lib/interceptor/interceptor.service';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PhoneMaskingDirective } from './shared/directives/phone-masking.directive';
import { NumberOnlyDirective } from './shared/directives/number-only.directive';
import { HomeModule } from './Platform/home/home.module';
import { SubscriptionModule } from './Platform/subscription/subscription.module';
import { ChangepasswordComponent } from './platform/setting/components/changepassword/changepassword.component';
import { SidebarComponent } from './shared/layout/sidebar/sidebar.component';
import { SolutionsComponent } from './home/components/solutions/solutions.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
export function createTranslateLoader(http: HttpClient) {
  const cacheBustSuffix = Date.now();
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/locales/', suffix: '.json?v=' + cacheBustSuffix },
  ]);
}
import { NgxStripeModule } from 'ngx-stripe';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [AppComponent, DashboardComponent, LanguageSelectorComponent, HeaderComponent, FooterComponent, MainComponent, ConfirmationDialogComponent, PhoneMaskingDirective, NumberOnlyDirective, ChangepasswordComponent, SidebarComponent, SolutionsComponent, ConfirmDialogComponent],
  imports: [
    BrowserModule,
    DashboardModule,
    ChartsModule,
    NgxStripeModule.forRoot('pk_test_51ILpJsFRXrII7xkxwrQpAr9ZIIGgBy4xiSC9Iv2pHOamjrEU1LRuzRrZAh8l2FXiaRIQjsCwYS2BWODYe5F3oTYs00aN68wZ8N'),
    //AuthModule,
    // RouterModule,
    HttpClientModule,
    //CommonUiModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreServicesModule,
    // material
    MatDialogModule,
    HomeModule,
    SubscriptionModule,
    TooltipModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    NgbPaginationModule,
    NgbAlertModule,
    NgbModule,
    MatSelectModule,
    MatListModule,
    MatFormFieldModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      closeButton: true
    }),
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SvInterceptorService,
      multi: true
    },
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [AppComponent],
  exports: [PhoneMaskingDirective, NumberOnlyDirective]
})
export class AppModule { }
