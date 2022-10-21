import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TimeoffTypeFormService, TimeoffTypeFormGroup } from './timeoff-type-form.service';
import { ITimeoffType } from '../timeoff-type.model';
import { TimeoffTypeService } from '../service/timeoff-type.service';

@Component({
  selector: 'jhi-timeoff-type-update',
  templateUrl: './timeoff-type-update.component.html',
})
export class TimeoffTypeUpdateComponent implements OnInit {
  isSaving = false;
  timeoffType: ITimeoffType | null = null;

  editForm: TimeoffTypeFormGroup = this.timeoffTypeFormService.createTimeoffTypeFormGroup();

  constructor(
    protected timeoffTypeService: TimeoffTypeService,
    protected timeoffTypeFormService: TimeoffTypeFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ timeoffType }) => {
      this.timeoffType = timeoffType;
      if (timeoffType) {
        this.updateForm(timeoffType);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const timeoffType = this.timeoffTypeFormService.getTimeoffType(this.editForm);
    if (timeoffType.timeoffTypeId !== null) {
      this.subscribeToSaveResponse(this.timeoffTypeService.update(timeoffType));
    } else {
      this.subscribeToSaveResponse(this.timeoffTypeService.create(timeoffType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITimeoffType>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(timeoffType: ITimeoffType): void {
    this.timeoffType = timeoffType;
    this.timeoffTypeFormService.resetForm(this.editForm, timeoffType);
  }
}
