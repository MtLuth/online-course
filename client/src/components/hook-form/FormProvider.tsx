import { UseFormReturn, FormProvider as RHFFormProvider } from 'react-hook-form';
import { FormEvent } from 'react';

type Props = {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
};

export default function FormProvider({ children, onSubmit, methods }: Props) {
  return (
    <RHFFormProvider {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </RHFFormProvider>
  );
}
