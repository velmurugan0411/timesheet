import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TimesheetDetailsComponent } from './list/timesheet-details.component';
import { TimesheetDetailsDetailComponent } from './detail/timesheet-details-detail.component';
import { TimesheetDetailsUpdateComponent } from './update/timesheet-details-update.component';
import { TimesheetDetailsDeleteDialogComponent } from './delete/timesheet-details-delete-dialog.component';
import { TimesheetDetailsRoutingModule } from './route/timesheet-details-routing.module';

@NgModule({
  imports: [SharedModule, TimesheetDetailsRoutingModule],
  declarations: [
    TimesheetDetailsComponent,
    TimesheetDetailsDetailComponent,
    TimesheetDetailsUpdateComponent,
    TimesheetDetailsDeleteDialogComponent,
  ],
})
export class TimesheetDetailsModule {}
