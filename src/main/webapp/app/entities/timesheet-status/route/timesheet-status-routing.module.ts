import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TimesheetStatusComponent } from '../list/timesheet-status.component';
import { TimesheetStatusDetailComponent } from '../detail/timesheet-status-detail.component';
import { TimesheetStatusUpdateComponent } from '../update/timesheet-status-update.component';
import { TimesheetStatusRoutingResolveService } from './timesheet-status-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const timesheetStatusRoute: Routes = [
  {
    path: '',
    component: TimesheetStatusComponent,
    data: {
      defaultSort: 'timesheetStatusId,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':timesheetStatusId/view',
    component: TimesheetStatusDetailComponent,
    resolve: {
      timesheetStatus: TimesheetStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TimesheetStatusUpdateComponent,
    resolve: {
      timesheetStatus: TimesheetStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':timesheetStatusId/edit',
    component: TimesheetStatusUpdateComponent,
    resolve: {
      timesheetStatus: TimesheetStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(timesheetStatusRoute)],
  exports: [RouterModule],
})
export class TimesheetStatusRoutingModule {}
