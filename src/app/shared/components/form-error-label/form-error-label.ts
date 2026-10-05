import { FormUtils } from '@/utils/formUtils';
import { ChangeDetectorRef, Component, inject, input, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'form-error-label',
  imports: [],
  templateUrl: './form-error-label.html',
})
export class FormErrorLabel {
  control = input.required<AbstractControl>();

  get errorMessage(){
    const errors: ValidationErrors = this.control().errors || {};
    //const errors = this.control().errors ?? {};

    return this.control().touched && Object.keys(errors).length>0 
      ? FormUtils.getTextError(errors)
      : null;
  }
}
