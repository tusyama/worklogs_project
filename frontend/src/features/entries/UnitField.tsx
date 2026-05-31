import {
  ENTRY_FORM_FIELD,
  UNIT_SELECT_CUSTOM,
  UI_TEXT,
  isPresetUnit,
} from "@worklog/shared";
import { useId } from "react";
import { FieldError, FieldWrapper } from "../../shared/ui-kit/Form/Form.styles";
import { Input, Label, Select, Stack } from "../../shared/ui-kit";

type UnitFieldProps = {
  unit: string;
  options: readonly string[];
  error?: string;
  onUnitChange: (value: string) => void;
};

export function UnitField({ unit, options, error, onUnitChange }: UnitFieldProps) {
  const t = UI_TEXT.entryForm;
  const selectId = useId();
  const customId = useId();
  const errorId = useId();
  const showCustom = !isPresetUnit(unit, options);
  const selectValue = showCustom ? UNIT_SELECT_CUSTOM : unit || options[0] || "";
  const labelFor = showCustom ? customId : selectId;

  return (
    <FieldWrapper>
      <Label htmlFor={labelFor} required>
        {t.unit}
      </Label>
      <Stack gap="xs">
        <Select
          id={selectId}
          data-testid="entry-unit-select"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          value={selectValue}
          onChange={(e) => {
            const next = e.target.value;
            if (next === UNIT_SELECT_CUSTOM) {
              onUnitChange("");
              return;
            }
            onUnitChange(next);
          }}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          <option value={UNIT_SELECT_CUSTOM}>{t.unitCustom}</option>
        </Select>
        {showCustom ? (
          <Input
            id={customId}
            data-testid="entry-unit-custom"
            name={ENTRY_FORM_FIELD.unit}
            value={unit}
            maxLength={32}
            onChange={(e) => onUnitChange(e.target.value)}
            placeholder={t.unitCustomPlaceholder}
            aria-label={t.unitCustomPlaceholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
        ) : null}
      </Stack>
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </FieldWrapper>
  );
}
