import type { ComponentProps } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type Props = ComponentProps<typeof Alert> & {
  title?: string;
  description?: string;
};

export function ErrorAlert({
  title = "Error",
  description = "Something went wrong",
  variant = "destructive",
  ...props
}: Props) {
  return (
    <Alert {...props}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
