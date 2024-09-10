import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';

interface ValidationError {
  [key: string]: string;
}

export const useFormValidation = <T extends z.ZodType<any, any>>(
  schema: T,
  initialValues?: Partial<z.infer<T>>
) => {
  type SchemaType = z.infer<T>;
  const [values, setValues] = useState<SchemaType>({} as SchemaType);
  const [errors, setErrors] = useState<ValidationError>({});

  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = useCallback(async (): Promise<boolean> => {
    try {
      await schema.parseAsync(values);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors: ValidationError = {};
        err.errors.forEach((error) => {
          if (error.path) {
            validationErrors[error.path.join('.')] = error.message;
          }
        });
        setErrors(validationErrors);
      }
      return false;
    }
  }, [values, schema]);

  return { values, handleChange, errors, validate, setValues };
};
