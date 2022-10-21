import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TimesheetStatusComponent } from './list/timesheet-status.component';
import { TimesheetStatusDetailComponent } from './detail/timesheet-status-detail.component';
import { TimesheetStatusUpdateComponent } from './update/timesheet-status-update.component';
import { TimesheetStatusDeleteDialogComponent } from './delete/timesheet-status-delete-dialog.component';
import { TimesheetStatusRoutingModule } from './route/timesheet-status-routing.module';

@NgModule({
  imports: [SharedModule, TimesheetStatusRoutingModule],
  declarations: [
    TimesheetStatusComponent,
    TimesheetStatusDetailComponent,
    TimesheetStatusUpdateComponent,
    TimesheetStatusDeleteDialogComponent,
  ],
})
export class TimesheetStatusModule {}
