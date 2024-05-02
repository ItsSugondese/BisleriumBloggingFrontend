import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderModule } from './management/manage-orders/order.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ManagementModule } from './management/management.module';
import { HomepageComponent } from './homepage/homepage.component';
import { UiModule } from '../shared/ui/ui.module';
import { NgprimeModule } from '../shared/module/ngprime.module';
import { FormModule } from '../shared/module/form.module';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackInspectComponent } from './feedback/feedback-inspect/feedback-inspect.component';
import { NgxModule } from '../shared/module/ngx.module';
import { UserOrderComponent } from './user-order/user-order.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../shared/module/material.module';
import { TestComponent } from './test/test.component';
import { TemplatesModule } from '../templates/templates.module';
import { FeaturesRoutingModule } from './features-routing.module';
import { AnnouncementComponent } from './announcement/announcement.component';
import { GenerateReportComponent } from './generate-report/generate-report.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { UserOrderHistoryComponent } from './user-order/user-order-history/user-order-history.component';
import { BlogInspectComponent } from './blog-inspect/blog-inspect.component';



@NgModule({
  declarations: [
    FeedbackComponent,
    TestComponent,
    AnnouncementComponent,
    GenerateReportComponent,
    OrderHistoryComponent,
    UserOrderHistoryComponent,
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    OrderModule,
    DashboardModule,
    ManagementModule,
    UiModule,
    NgprimeModule,
    FormModule,
    NgxModule,
    FlexLayoutModule,
    MaterialModule,
    TemplatesModule
  ]
})
export class FeaturesModule { }
