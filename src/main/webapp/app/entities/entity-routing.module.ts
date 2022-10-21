import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'timesheet',
        data: { pageTitle: 'timesheetApp.timesheet.home.title' },
        loadChildren: () => import('./timesheet/timesheet.module').then(m => m.TimesheetModule),
      },
      {
        path: 'timesheet-details',
        data: { pageTitle: 'timesheetApp.timesheetDetails.home.title' },
        loadChildren: () => import('./timesheet-details/timesheet-details.module').then(m => m.TimesheetDetailsModule),
      },
      {
        path: 'timeoff-type',
        data: { pageTitle: 'timesheetApp.timeoffType.home.title' },
        loadChildren: () => import('./timeoff-type/timeoff-type.module').then(m => m.TimeoffTypeModule),
      },
      {
        path: 'timesheet-status',
        data: { pageTitle: 'timesheetApp.timesheetStatus.home.title' },
        loadChildren: () => import('./timesheet-status/timesheet-status.module').then(m => m.TimesheetStatusModule),
      },
      {
        path: 'user-task',
        data: { pageTitle: 'timesheetApp.userTask.home.title' },
        loadChildren: () => import('./user-task/user-task.module').then(m => m.UserTaskModule),
      },
      {
        path: 'task',
        data: { pageTitle: 'timesheetApp.task.home.title' },
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
      },
      {
        path: 'project',
        data: { pageTitle: 'timesheetApp.project.home.title' },
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
      },
      {
        path: 'customer',
        data: { pageTitle: 'timesheetApp.customer.home.title' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
