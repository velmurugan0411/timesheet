import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TimeoffTypeComponent } from '../list/timeoff-type.component';
import { TimeoffTypeDetailComponent } from '../detail/timeoff-type-detail.component';
import { TimeoffTypeUpdateComponent } from '../update/timeoff-type-update.component';
import { TimeoffTypeRoutingResolveService } from './timeoff-type-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const timeoffTypeRoute: Routes = [
  {
    path: '',
    component: TimeoffTypeComponent,
    data: {
      defaultSort: 'timeoffTypeId,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':timeoffTypeId/view',
    component: TimeoffTypeDetailComponent,
    resolve: {
      timeoffType: TimeoffTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TimeoffTypeUpdateComponent,
    resolve: {
      timeoffType: TimeoffTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':timeoffTypeId/edit',
    component: TimeoffTypeUpdateComponent,
    resolve: {
      timeoffType: TimeoffTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(timeoffTypeRoute)],
  exports: [RouterModule],
})
export class TimeoffTypeRoutingModule {}
