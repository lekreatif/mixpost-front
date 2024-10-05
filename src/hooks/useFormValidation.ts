// useFormValidation.ts
import { useState, useCallback, useEffect } from "react";
import { z } from "zod";

interface ValidationError {
  [key: string]: string;
}

export const useFormValidation = <T extends z.ZodType<any, any>>(
  schema: T,
  initialValues?: Partial<z.infer<T>>
) => {
  type SchemaType = z.infer<T>;
  const [values, setValues] = useState<SchemaType>(
    initialValues ?? ({} as SchemaType)
  );
  const [errors, setErrors] = useState<ValidationError>({});
  const [isValid, setIsValid] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  const validateField = useCallback(
    async (name: string, value: any) => {
      try {
        await (schema as unknown as z.ZodObject<any>)
          .pick({ [name]: true })
          .parseAsync({ [name]: value });
        setErrors(prev => ({ ...prev, [name]: undefined }) as ValidationError);
      } catch (err) {
        if (err instanceof z.ZodError) {
          setErrors(prev => ({
            ...prev,
            [name]: err.errors[0]?.message || `Invalid ${name}`,
          }));
        }
      }
    },
    [schema]
  );

  const validate = useCallback(async (): Promise<boolean> => {
    try {
      await schema.parseAsync(values);
      setErrors({});
      setIsValid(true);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors: ValidationError = {};
        err.errors.forEach(error => {
          if (error.path) {
            validationErrors[error.path.join(".")] = error.message;
          }
        });
        setErrors(validationErrors);
      }
      setIsValid(false);
      return false;
    }
  }, [values, schema]);

  useEffect(() => {
    validate();
  }, [values, validate]);

  return {
    values,
    handleChange,
    errors,
    validate,
    setValues,
    isValid,
    validateField,
  };
};
