import { type FC } from "react";
import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { SomeIcon } from "lucide-react";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export const ComponentName: FC<Props> = ({ className, children }) => {
  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  );
};