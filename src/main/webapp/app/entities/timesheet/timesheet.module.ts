import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TimesheetComponent } from './list/timesheet.component';
import { TimesheetDetailComponent } from './detail/timesheet-detail.component';
import { TimesheetUpdateComponent } from './update/timesheet-update.component';
import { TimesheetDeleteDialogComponent } from './delete/timesheet-delete-dialog.component';
import { TimesheetRoutingModule } from './route/timesheet-routing.module';

@NgModule({
  imports: [SharedModule, TimesheetRoutingModule],
  declarations: [TimesheetComponent, TimesheetDetailComponent, TimesheetUpdateComponent, TimesheetDeleteDialogComponent],
})
export class TimesheetModule {}
