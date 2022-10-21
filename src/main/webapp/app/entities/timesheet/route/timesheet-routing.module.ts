import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TimesheetComponent } from '../list/timesheet.component';
import { TimesheetDetailComponent } from '../detail/timesheet-detail.component';
import { TimesheetUpdateComponent } from '../update/timesheet-update.component';
import { TimesheetRoutingResolveService } from './timesheet-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const timesheetRoute: Routes = [
  {
    path: '',
    component: TimesheetComponent,
    data: {
      defaultSort: 'timesheetId,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':timesheetId/view',
    component: TimesheetDetailComponent,
    resolve: {
      timesheet: TimesheetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TimesheetUpdateComponent,
    resolve: {
      timesheet: TimesheetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':timesheetId/edit',
    component: TimesheetUpdateComponent,
    resolve: {
      timesheet: TimesheetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(timesheetRoute)],
  exports: [RouterModule],
})
export class TimesheetRoutingModule {}
