import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AxiosError, AxiosPromise, AxiosResponse } from "axios";
import { object, string, number } from "yup";
import {
  ActionGroup,
  Alert,
  Button,
  ButtonVariant,
  Form,
  NumberInput,
} from "@patternfly/react-core";

import {
  DEFAULT_SELECT_MAX_HEIGHT,
  COLOR_HEX_VALUES_BY_NAME,
} from "@app/Constants";
import { createTagCategory, updateTagCategory } from "@app/api/rest";
import { TagCategory } from "@app/api/models";
import { duplicateNameCheck, getAxiosErrorMessage } from "@app/utils/utils";
import { toOptionLike } from "@app/utils/model-utils";
import { useFetchTagCategories } from "@app/queries/tags";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  HookFormPFGroupController,
  HookFormPFTextInput,
} from "@app/shared/components/hook-form-pf-fields";
import { Color, OptionWithValue, SimpleSelect } from "@app/shared/components";
export interface FormValues {
  name: string;
  rank?: number;
  color: string | null;
}

export interface TagCategoryFormProps {
  tagCategory?: TagCategory;
  onSaved: (response: AxiosResponse<TagCategory>) => void;
  onCancel: () => void;
}

export const TagCategoryForm: React.FC<TagCategoryFormProps> = ({
  tagCategory: tagCategory,
  onSaved,
  onCancel,
}) => {
  const { t } = useTranslation();

  const [error, setError] = useState<AxiosError>();

  const { tagCategories: tagCategories } = useFetchTagCategories();

  const validationSchema = object().shape({
    name: string()
      .trim()
      .required(t("validation.required"))
      .min(3, t("validation.minLength", { length: 3 }))
      .max(40, t("validation.maxLength", { length: 40 }))
      .test(
        "Duplicate name",
        "A tag type with this name already exists. Use a different name.",
        (value) => {
          return duplicateNameCheck(
            tagCategories || [],
            tagCategory || null,
            value || ""
          );
        }
      ),
    rank: number().min(1, t("validation.min", { value: 1 })),
    color: string()
      .trim()
      .nullable()
      .required(t("validation.required"))
      .min(1, t("validation.minLength", { length: 3 })),
  });
  const {
    handleSubmit,
    formState: { isSubmitting, isValidating, isValid, isDirty },
    getValues,
    setValue,
    control,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      name: tagCategory?.name || "",
      rank: tagCategory?.rank || 1,
      color: tagCategory?.colour || null,
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit = (formValues: FormValues) => {
    const payload: TagCategory = {
      name: formValues.name.trim(),
      rank: formValues.rank,
      colour: formValues.color || undefined,
    };

    let promise: AxiosPromise<TagCategory>;
    if (tagCategory) {
      promise = updateTagCategory({
        ...tagCategory,
        ...payload,
      });
    } else {
      promise = createTagCategory(payload);
    }

    promise
      .then((response) => {
        onSaved(response);
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert variant="danger" isInline title={getAxiosErrorMessage(error)} />
      )}
      <HookFormPFTextInput
        control={control}
        name="name"
        label="Name"
        fieldId="name"
        isRequired
      />
      <HookFormPFGroupController
        control={control}
        name="rank"
        label={t("terms.rank")}
        fieldId="rank"
        renderInput={({ field: { value, name, onChange } }) => (
          <NumberInput
            inputName={name}
            inputAriaLabel="rank"
            minusBtnAriaLabel="minus"
            plusBtnAriaLabel="plus"
            value={value}
            min={1}
            max={10}
            onMinus={() => {
              onChange((value || 0) - 1);
            }}
            onChange={onChange}
            onPlus={() => {
              onChange((value || 0) + 1);
            }}
          />
        )}
      />
      <HookFormPFGroupController
        control={control}
        name="color"
        label={t("terms.color")}
        fieldId="color"
        isRequired
        renderInput={({ field: { value, name, onChange } }) => (
          <SimpleSelect
            variant="single"
            maxHeight={DEFAULT_SELECT_MAX_HEIGHT}
            id="type-select"
            toggleId="type-select-toggle"
            toggleAriaLabel="Type select dropdown toggle"
            aria-label={name}
            value={
              value
                ? toOptionLike(
                    value,
                    Object.values(COLOR_HEX_VALUES_BY_NAME).map((color) => {
                      return {
                        value: color,
                        toString: () => color,
                        props: {
                          children: <Color hex={color} />,
                        },
                      };
                    })
                  )
                : undefined
            }
            options={Object.values(COLOR_HEX_VALUES_BY_NAME).map((color) => {
              return {
                value: color,
                toString: () => color,
                props: {
                  children: <Color hex={color} />,
                },
              };
            })}
            onChange={(selection) => {
              const selectionValue = selection as OptionWithValue<string>;
              onChange(selectionValue.value);
            }}
          />
        )}
      />
      <ActionGroup>
        <Button
          type="submit"
          id="tag-type-form-submit"
          aria-label="submit"
          variant={ButtonVariant.primary}
          isDisabled={!isValid || isSubmitting || isValidating || !isDirty}
        >
          {!tagCategory ? t("actions.create") : t("actions.save")}
        </Button>
        <Button
          type="button"
          id="cancel"
          aria-label="cancel"
          variant={ButtonVariant.link}
          isDisabled={!isValid || isSubmitting || isValidating || !isDirty}
          onClick={onCancel}
        >
          {t("actions.cancel")}
        </Button>
      </ActionGroup>
    </Form>
  );
};
