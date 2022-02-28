import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ProductandfeaturesComponent } from './components/productandfeatures/productandfeatures.component';
import { PrcingComponent } from './components/prcing/prcing.component';
import { ImigrationandpartnersComponent } from './components/imigrationandpartners/imigrationandpartners.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { CarrerComponent } from './components/carrer/carrer.component';
import { CompanyInfoComponent } from './components/company-info/company-info.component';
import { ContactComponent } from './components/contact/contact.component';
import { DemoComponent } from './components/demo/demo.component';
import { FaqCatComponent } from './components/faq-cat/faq-cat.component';
import { FaqDetailsComponent } from './components/faq-details/faq-details.component';
import { HelpComponent } from './components/help/help.component';
import { ImigrationComponent } from './components/imigration/imigration.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { ProductComponent } from './components/product/product.component';
import { SitemapComponent } from './components/sitemap/sitemap.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { TermsComponent } from './components/terms/terms.component';
import { TopicsComponent } from './components/topics/topics.component';
import { HomeheaderComponent } from './components/homeheader/homeheader.component';
import { HomefooterComponent } from './components/homefooter/homefooter.component';
import { BookmarkComponent } from './components/bookmark/bookmark.component';
import { SolutionsComponent } from './components/solutions/solutions.component';
import { EmailComponent } from './components/email/email.component';
import { CopyRightComponent } from './components/copy-right/copy-right.component';
import { AdvertiseComponent } from './components/advertise/advertise.component';


@NgModule({
  declarations: [HomeComponent, AboutComponent, ProductandfeaturesComponent, PrcingComponent, ImigrationandpartnersComponent, ResourcesComponent, CarrerComponent, CompanyInfoComponent, ContactComponent, DemoComponent, FaqCatComponent, FaqDetailsComponent, HelpComponent, ImigrationComponent, PrivacyComponent, ProductComponent, SitemapComponent, SubscriptionComponent, TermsComponent, TopicsComponent, HomeheaderComponent, HomefooterComponent, BookmarkComponent, SolutionsComponent, EmailComponent, CopyRightComponent, AdvertiseComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }
