import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RadiologyComponent } from './radiology/radiology.component';
import { RadiologysComponent } from './radiologys/radiologys.component';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './login/iterceptors/token.interceptor';
import { AuthInterceptor } from './login/iterceptors/auth.interceptor';
import { AdminComponent } from './admin/admin.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PageUserComponent } from './page-user/page-user.component';
import { ProfileComponent } from './profile/profile.component';
import { LostPasswordComponent } from './lost-password/lost-password.component';
import { ReferenceLinesToolComponent } from './reference-lines-tool/reference-lines-tool.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    RadiologyComponent,
    RadiologysComponent,
    LoginComponent,
    RegisterComponent,
    AdminComponent,
    PageUserComponent,
    ProfileComponent,
    LostPasswordComponent,
    ReferenceLinesToolComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxChartsModule,
    HttpClientModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi:true},
    {provide: HTTP_INTERCEPTORS, useClass:TokenInterceptor, multi:true},

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
