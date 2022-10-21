import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserTaskComponent } from '../list/user-task.component';
import { UserTaskDetailComponent } from '../detail/user-task-detail.component';
import { UserTaskUpdateComponent } from '../update/user-task-update.component';
import { UserTaskRoutingResolveService } from './user-task-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userTaskRoute: Routes = [
  {
    path: '',
    component: UserTaskComponent,
    data: {
      defaultSort: 'userTaskId,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':userTaskId/view',
    component: UserTaskDetailComponent,
    resolve: {
      userTask: UserTaskRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserTaskUpdateComponent,
    resolve: {
      userTask: UserTaskRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':userTaskId/edit',
    component: UserTaskUpdateComponent,
    resolve: {
      userTask: UserTaskRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userTaskRoute)],
  exports: [RouterModule],
})
export class UserTaskRoutingModule {}
