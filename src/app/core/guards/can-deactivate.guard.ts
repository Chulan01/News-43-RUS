import { Injectable } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { FormGroup } from '@angular/forms';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Promise<boolean>;
}

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  if (component.canDeactivate()) {
    return true;
  }
  
  return confirm('У вас есть несохранённые изменения. Вы уверены, что хотите уйти?');
};
