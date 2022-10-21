import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITimesheetStatus } from '../timesheet-status.model';
import { TimesheetStatusService } from '../service/timesheet-status.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './timesheet-status-delete-dialog.component.html',
})
export class TimesheetStatusDeleteDialogComponent {
  timesheetStatus?: ITimesheetStatus;

  constructor(protected timesheetStatusService: TimesheetStatusService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.timesheetStatusService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
