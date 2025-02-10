import type { LucideIcon, LucideProps } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { useContext } from "react";
import { TextClassContext } from "./text";
import { cn } from "./utils";

type Props = LucideProps & {
  as: LucideIcon;
};

export function Icon({ as: Component, className, ...props }: Props) {
  cssInterop(Component, {
    className: {
      target: "style",
      nativeStyleToProp: {
        width: true,
        height: true,
        color: true,
        opacity: true,
      },
    },
  });

  const textClassName = useContext(TextClassContext);

  return (
    <Component size={16} className={cn(textClassName, className)} {...props} />
  );
}
