import type { FieldError } from "react-hook-form";
import { Text } from "./ui/text";

type Props = {
  error: FieldError | undefined;
};

export function FormFieldError({ error }: Props) {
  if (!error) {
    return null;
  }

  return <Text className="text-destructive text-sm">{error.message}</Text>;
}
