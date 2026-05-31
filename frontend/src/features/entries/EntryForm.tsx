import { zodResolver } from "@hookform/resolvers/zod";
import {
  ENTRY_FORM_FIELD,
  UI_TEXT,
  buildUnitOptions,
  workEntryCreateSchema,
  type WorkEntryCreate,
  type WorkEntryDto,
  type WorkTypeDto,
} from "@worklog/shared";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Input, Select, Text } from "@/shared/ui-kit";
import { buildCreateDefaults } from "./entry-form.defaults";
import { UnitField } from "./UnitField";

type EntryFormProps = {
  workTypes: WorkTypeDto[];
  initial?: WorkEntryDto;
  submitError?: string | null;
  onSubmit: (data: WorkEntryCreate) => void | Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
};

function toEditDefaults(initial: WorkEntryDto): WorkEntryCreate {
  return {
    completedAt: initial.completedAt,
    workTypeId: initial.workTypeId,
    volume: initial.volume,
    unit: initial.unit,
    performerName: initial.performerName,
  };
}

export function EntryForm({
  workTypes,
  initial,
  submitError,
  onSubmit,
  onCancel,
  submitting,
}: EntryFormProps) {
  const unitOptions = useMemo(
    () => buildUnitOptions(workTypes.map((wt) => wt.defaultUnit)),
    [workTypes],
  );

  const createDefaults = useMemo(() => buildCreateDefaults(workTypes), [workTypes]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WorkEntryCreate>({
    resolver: zodResolver(workEntryCreateSchema),
    defaultValues: initial ? toEditDefaults(initial) : createDefaults,
  });

  useEffect(() => {
    if (initial) {
      reset(toEditDefaults(initial));
    }
  }, [initial?.id, initial, reset]);

  useEffect(() => {
    if (!initial) {
      reset(createDefaults);
    }
  }, [createDefaults, initial, reset]);

  const workTypeId = watch(ENTRY_FORM_FIELD.workTypeId);
  const unit = watch(ENTRY_FORM_FIELD.unit);

  useEffect(() => {
    if (initial) return;
    const selected = workTypes.find((t) => t.id === workTypeId);
    if (selected?.defaultUnit) {
      setValue(ENTRY_FORM_FIELD.unit, selected.defaultUnit, { shouldValidate: true });
    }
  }, [workTypeId, workTypes, initial, setValue]);

  const t = UI_TEXT.entryForm;

  return (
    <Form.Root onSubmit={handleSubmit(onSubmit)}>
      <Form.Stack>
        <Form.Field label={t.completedAt} required error={errors.completedAt?.message}>
          <Input type="date" {...register(ENTRY_FORM_FIELD.completedAt)} />
        </Form.Field>
        <Form.Field label={t.workType} required error={errors.workTypeId?.message}>
          <Select {...register(ENTRY_FORM_FIELD.workTypeId)}>
            {!workTypes.length ? <option value="">{t.noWorkTypes}</option> : null}
            {workTypes.map((wt) => (
              <option key={wt.id} value={wt.id}>
                {wt.name}
              </option>
            ))}
          </Select>
        </Form.Field>
        <Form.Field label={t.volume} required error={errors.volume?.message}>
          <Input
            type="number"
            step="any"
            min="0.0001"
            {...register(ENTRY_FORM_FIELD.volume, { valueAsNumber: true })}
          />
        </Form.Field>
        <UnitField
          unit={unit ?? ""}
          options={unitOptions}
          error={errors.unit?.message}
          onUnitChange={(value) =>
            setValue(ENTRY_FORM_FIELD.unit, value, { shouldValidate: true, shouldDirty: true })
          }
        />
        <Form.Field label={t.performer} required error={errors.performerName?.message}>
          <Input maxLength={200} {...register(ENTRY_FORM_FIELD.performerName)} />
        </Form.Field>
        {submitError ? (
          <Text variant="body" role="alert" style={{ color: "#c62828" }}>
            {submitError}
          </Text>
        ) : null}
      </Form.Stack>
      <Form.Actions>
        <Button $variant="ghost" type="button" onClick={onCancel} disabled={submitting}>
          {t.cancel}
        </Button>
        <Button $variant="primary" type="submit" disabled={submitting}>
          {submitting ? t.saving : t.save}
        </Button>
      </Form.Actions>
    </Form.Root>
  );
}
