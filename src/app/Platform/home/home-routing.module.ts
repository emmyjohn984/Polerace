import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from 'src/app/shared/layout/main/main.component';
import { AboutComponent } from './components/about/about.component';
import { AdvertiseComponent } from './components/advertise/advertise.component';
import { BookmarkComponent } from './components/bookmark/bookmark.component';
import { CarrerComponent } from './components/carrer/carrer.component';
import { CompanyInfoComponent } from './components/company-info/company-info.component';
import { ContactComponent } from './components/contact/contact.component';
import { CopyRightComponent } from './components/copy-right/copy-right.component';
import { DemoComponent } from './components/demo/demo.component';
import { EmailComponent } from './components/email/email.component';
import { FaqCatComponent } from './components/faq-cat/faq-cat.component';
import { FaqDetailsComponent } from './components/faq-details/faq-details.component';
import { HelpComponent } from './components/help/help.component';
import { HomeComponent } from './components/home/home.component';
import { ImigrationandpartnersComponent } from './components/imigrationandpartners/imigrationandpartners.component';
import { PrcingComponent } from './components/prcing/prcing.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { ProductComponent } from './components/product/product.component';
import { ProductandfeaturesComponent } from './components/productandfeatures/productandfeatures.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { SitemapComponent } from './components/sitemap/sitemap.component';
import { SolutionsComponent } from './components/solutions/solutions.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { TermsComponent } from './components/terms/terms.component';
import { TopicsComponent } from './components/topics/topics.component';


const routes: Routes = [


        {
          path: 'home', component: HomeComponent, pathMatch: 'full'
        },
        {
          path: 'aboutus', component: AboutComponent, pathMatch: 'full'
        },
        {
          path: 'productsandfeatures', component: ProductandfeaturesComponent, pathMatch: 'full'
        },
        {
          path: 'pricing', component:PrcingComponent,pathMatch: 'full'
        },
        {
          path: 'carrer', component:CarrerComponent,pathMatch: 'full'
        },
        {
          path: 'companyinfo', component:CompanyInfoComponent,pathMatch: 'full'
        },
        {
          path: 'contact', component:ContactComponent,pathMatch: 'full'
        },
        {
          path: 'demo', component:DemoComponent,pathMatch: 'full'
        },
        {
          path: 'faq-categories', component:FaqCatComponent,pathMatch: 'full'
        },
        {
          path: 'faq-details', component:FaqDetailsComponent,pathMatch: 'full'
        },
        {
          path: 'help', component:HelpComponent,pathMatch: 'full'
        },
        {
          path: 'intigrationandpartners', component:ImigrationandpartnersComponent,pathMatch: 'full'
        },
        {
          path: 'privacy', component:PrivacyComponent,pathMatch: 'full'
        },
        {
          path: 'product', component:ProductComponent,pathMatch: 'full'
        },
        {
          path: 'productfeatures', component:ProductandfeaturesComponent, pathMatch: 'full'
        },
        {
          path: 'sitemap', component:SitemapComponent,pathMatch: 'full'
        },
        {
          path: 'subscription', component:SubscriptionComponent,pathMatch: 'full'
        },
        {
          path: 'terms', component:TermsComponent,pathMatch: 'full'
        },
        {
          path: 'topic', component:TopicsComponent,pathMatch: 'full'
        },
        {
          path: 'resources', component:ResourcesComponent,pathMatch: 'full'
        },
        {
          path: 'email', component:EmailComponent,pathMatch:'full'
        },
        {
          path: 'bookmark', component:BookmarkComponent,pathMatch:'full'
        },
        {
          path: 'solutions', component:SolutionsComponent,pathMatch:'full'
        },
        {
          path:'advertise', component:AdvertiseComponent, pathMatch:'full'
        },
        {
          path:'copy-right', component:CopyRightComponent, pathMatch:'full'
        },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
