import type { ComponentProps } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type Props = ComponentProps<typeof Alert> & {
  error: Error | null;
};

export function FormError({ error, variant = "destructive", ...props }: Props) {
  if (!error) {
    return null;
  }

  return (
    <Alert variant={variant} {...props}>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
