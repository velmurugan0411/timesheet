import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProject, NewProject } from '../project.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { projectId: unknown }> = Partial<Omit<T, 'projectId'>> & { projectId: T['projectId'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProject for edit and NewProjectFormGroupInput for create.
 */
type ProjectFormGroupInput = IProject | PartialWithRequiredKeyOf<NewProject>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IProject | NewProject> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

type ProjectFormRawValue = FormValueOf<IProject>;

type NewProjectFormRawValue = FormValueOf<NewProject>;

type ProjectFormDefaults = Pick<NewProject, 'projectId' | 'startDate' | 'endDate'>;

type ProjectFormGroupContent = {
  projectId: FormControl<ProjectFormRawValue['projectId'] | NewProject['projectId']>;
  projectName: FormControl<ProjectFormRawValue['projectName']>;
  description: FormControl<ProjectFormRawValue['description']>;
  startDate: FormControl<ProjectFormRawValue['startDate']>;
  endDate: FormControl<ProjectFormRawValue['endDate']>;
  customerId: FormControl<ProjectFormRawValue['customerId']>;
};

export type ProjectFormGroup = FormGroup<ProjectFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProjectFormService {
  createProjectFormGroup(project: ProjectFormGroupInput = { projectId: null }): ProjectFormGroup {
    const projectRawValue = this.convertProjectToProjectRawValue({
      ...this.getFormDefaults(),
      ...project,
    });
    return new FormGroup<ProjectFormGroupContent>({
      projectId: new FormControl(
        { value: projectRawValue.projectId, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      projectName: new FormControl(projectRawValue.projectName),
      description: new FormControl(projectRawValue.description),
      startDate: new FormControl(projectRawValue.startDate, {
        validators: [Validators.required],
      }),
      endDate: new FormControl(projectRawValue.endDate, {
        validators: [Validators.required],
      }),
      customerId: new FormControl(projectRawValue.customerId, {
        validators: [Validators.required],
      }),
    });
  }

  getProject(form: ProjectFormGroup): IProject | NewProject {
    return this.convertProjectRawValueToProject(form.getRawValue() as ProjectFormRawValue | NewProjectFormRawValue);
  }

  resetForm(form: ProjectFormGroup, project: ProjectFormGroupInput): void {
    const projectRawValue = this.convertProjectToProjectRawValue({ ...this.getFormDefaults(), ...project });
    form.reset(
      {
        ...projectRawValue,
        projectId: { value: projectRawValue.projectId, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProjectFormDefaults {
    const currentTime = dayjs();

    return {
      projectId: null,
      startDate: currentTime,
      endDate: currentTime,
    };
  }

  private convertProjectRawValueToProject(rawProject: ProjectFormRawValue | NewProjectFormRawValue): IProject | NewProject {
    return {
      ...rawProject,
      startDate: dayjs(rawProject.startDate, DATE_TIME_FORMAT),
      endDate: dayjs(rawProject.endDate, DATE_TIME_FORMAT),
    };
  }

  private convertProjectToProjectRawValue(
    project: IProject | (Partial<NewProject> & ProjectFormDefaults)
  ): ProjectFormRawValue | PartialWithRequiredKeyOf<NewProjectFormRawValue> {
    return {
      ...project,
      startDate: project.startDate ? project.startDate.format(DATE_TIME_FORMAT) : undefined,
      endDate: project.endDate ? project.endDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
