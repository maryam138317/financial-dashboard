"use client";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import {
  Transaction,
  TransactionCategory,
  incomeCategories,
  exposeCategories,
  savingCategories,
} from "@/lib/types";

import { useTransactionStore } from "@/store/useTransactionStore";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldTitle,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

const formSchema = z.object({
  amount: z
    .number("Amount is required")
    .positive("Amount must be greater than 0"),

  type: z.enum(["Income", "Expose", "Savings"]),

  category: z
    .string()
    .min(1, "Category is required"),

  date: z.date({
    error: "Date of transaction is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  transaction?: Transaction;
  onSuccess?: () => void;
}

export default function TransactionForm({
  transaction,
  onSuccess,
}: TransactionFormProps) {
  const addTransaction = useTransactionStore(
    (state) => state.addTransaction
  );

  const editTransaction = useTransactionStore(
    (state) => state.editTransaction
  );

  const isEditing = Boolean(transaction);

  const {
    handleSubmit,
    control,
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      amount: transaction?.amount ?? undefined,
      type: transaction?.type ?? "Expose",
      category: transaction?.category ?? "",
      date: transaction?.date
        ? new Date(transaction.date)
        : new Date(),
    },
  });

  const selectedType = watch("type");

  const categories: readonly string[] =
    selectedType === "Income"
      ? incomeCategories
      : selectedType === "Expose"
        ? exposeCategories
        : savingCategories;

  function submitForm(data: FormValues) {
    const transactionData = {
      ...data,
      category: data.category as TransactionCategory,
    };

    if (transaction) {
      editTransaction(
        transaction.id,
        transactionData
      );
    } else {
      addTransaction(transactionData);
    }

    onSuccess?.();
  }

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-5"
    >
      <FieldGroup>

        {/* Amount */}
        <Controller
          name="amount"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldTitle>
                Amount
              </FieldTitle>

              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={field.value ?? ""}
                onChange={(event) => {
                  const value = event.target.value;

                  field.onChange(
                    value === ""
                      ? undefined
                      : Number(value)
                  );
                }}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-red-600"
                />
              )}
            </Field>
          )}
        />

        {/* Type */}
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldTitle>
                Type
              </FieldTitle>

              <Select
                value={field.value}
                onValueChange={(value) => {
                  if (!value) return;

                  field.onChange(value);

                  // Reset category when type changes
                  setValue("category", "");
                }}
              >
                <SelectTrigger
                  id="type"
                  className="w-full"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Income">
                    Income
                  </SelectItem>

                  <SelectItem value="Expose">
                    Expense
                  </SelectItem>

                  <SelectItem value="Savings">
                    Savings
                  </SelectItem>
                </SelectContent>
              </Select>

              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-red-600"
                />
              )}
            </Field>
          )}
        />

        {/* Category */}
        <Controller
          name="category"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldTitle>
                Category
              </FieldTitle>

              <Select
                value={field.value || null}
                onValueChange={(value) => {
                  if (!value) return;

                  field.onChange(value);
                }}
              >
                <SelectTrigger
                  id="category"
                  className="w-full"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-red-600"
                />
              )}
            </Field>
          )}
        />

        {/* Date */}
        <Controller
          name="date"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldTitle>
                Date
              </FieldTitle>

              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      id="date"
                      className={cn(
                        "w-full justify-between font-normal",
                        !field.value &&
                          "text-muted-foreground"
                      )}
                      aria-invalid={fieldState.invalid}
                    />
                  }
                >
                  {field.value
                    ? format(field.value, "PPP")
                    : "Select a date"}

                  <CalendarIcon className="size-4 opacity-50" />
                </PopoverTrigger>

                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>

              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-red-600"
                />
              )}
            </Field>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
        >
          {isEditing
            ? "Update Transaction"
            : "Add Transaction"}
        </Button>

      </FieldGroup>
    </form>
  );
}
