import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './components/login.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {  ReactiveFormsModule,FormsModule } from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';
import { RegisterComponent } from './components/register/register.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { HeaderComponent } from 'libs/common-ui/src/lib/header/header.component';
import { AuthheaderComponent } from './components/authheader/authheader.component';
import { AuthfooterComponent } from './components/authfooter/authfooter.component';
import { RetrivepasswordComponent } from './components/retrivepassword/retrivepassword.component';
import { MatCardModule } from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ResetpasswordComponent, AuthheaderComponent, AuthfooterComponent, RetrivepasswordComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    // TranslateModule,
    MatInputModule,
    MatButtonModule,
     ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  entryComponents: [LoginComponent,RegisterComponent],
  providers: [],
  // exports: [TranslateModule]
})
export class LogModule { }
