import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITimesheetDetails } from '../timesheet-details.model';
import { TimesheetDetailsService } from '../service/timesheet-details.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './timesheet-details-delete-dialog.component.html',
})
export class TimesheetDetailsDeleteDialogComponent {
  timesheetDetails?: ITimesheetDetails;

  constructor(protected timesheetDetailsService: TimesheetDetailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.timesheetDetailsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
