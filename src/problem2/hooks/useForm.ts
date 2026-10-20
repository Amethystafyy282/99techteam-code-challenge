import { useState, type FormEvent } from 'react';

export const useForm = <TValues extends object>(initialValues: TValues) => {
  const [values, setValues] = useState(initialValues);
  const [isTouched, setIsTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = <TKey extends keyof TValues>(key: TKey, value: TValues[TKey]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const handleSubmit = (onSubmit: (() => Promise<void>) | null) => async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsTouched(true);

    if (!onSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit();
      setIsTouched(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { values, setValue, setValues, isTouched, setIsTouched, isSubmitting, handleSubmit };
};
