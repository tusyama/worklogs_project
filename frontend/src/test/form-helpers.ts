import { ENTRY_FORM_FIELD } from "@worklog/shared";
import { fireEvent } from "@testing-library/react";

function getNamedField(scope: HTMLElement, name: string) {
  const el = scope.querySelector(`[name="${name}"]`);
  if (!el) {
    throw new Error(`Field [name="${name}"] not found`);
  }
  return el;
}

/** Fills performer so create form passes Zod; other fields use RHF defaults. */
export function fillPerformer(scope: HTMLElement, value: string) {
  fireEvent.change(getNamedField(scope, ENTRY_FORM_FIELD.performerName), {
    target: { value },
  });
}

export function setVolume(scope: HTMLElement, value: string) {
  fireEvent.change(getNamedField(scope, ENTRY_FORM_FIELD.volume), {
    target: { value },
  });
}

export function submitForm(scope: HTMLElement) {
  const form = scope.querySelector("form");
  if (!form) {
    throw new Error("Form not found in scope");
  }
  fireEvent.submit(form);
}
