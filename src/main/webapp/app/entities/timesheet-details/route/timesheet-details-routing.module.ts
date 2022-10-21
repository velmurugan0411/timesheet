import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TimesheetDetailsComponent } from '../list/timesheet-details.component';
import { TimesheetDetailsDetailComponent } from '../detail/timesheet-details-detail.component';
import { TimesheetDetailsUpdateComponent } from '../update/timesheet-details-update.component';
import { TimesheetDetailsRoutingResolveService } from './timesheet-details-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const timesheetDetailsRoute: Routes = [
  {
    path: '',
    component: TimesheetDetailsComponent,
    data: {
      defaultSort: 'timesheetDetailsId,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':timesheetDetailsId/view',
    component: TimesheetDetailsDetailComponent,
    resolve: {
      timesheetDetails: TimesheetDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TimesheetDetailsUpdateComponent,
    resolve: {
      timesheetDetails: TimesheetDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':timesheetDetailsId/edit',
    component: TimesheetDetailsUpdateComponent,
    resolve: {
      timesheetDetails: TimesheetDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(timesheetDetailsRoute)],
  exports: [RouterModule],
})
export class TimesheetDetailsRoutingModule {}
