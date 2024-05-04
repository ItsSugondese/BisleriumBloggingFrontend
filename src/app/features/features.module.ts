import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormModule } from '../shared/module/form.module';
import { MaterialModule } from '../shared/module/material.module';
import { NgprimeModule } from '../shared/module/ngprime.module';
import { NgxModule } from '../shared/module/ngx.module';
import { UiModule } from '../shared/ui/ui.module';
import { TemplatesModule } from '../templates/templates.module';
import { AnnouncementComponent } from './announcement/announcement.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { FeaturesRoutingModule } from './features-routing.module';
import { FeedbackComponent } from './feedback/feedback.component';
import { GenerateReportComponent } from './generate-report/generate-report.component';
import { OrderModule } from './management/manage-orders/order.module';
import { ManagementModule } from './management/management.module';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { TestComponent } from './test/test.component';
import { UserOrderHistoryComponent } from './user-order/user-order-history/user-order-history.component';



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
