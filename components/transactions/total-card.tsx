import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";

interface TotalCardProps {
  title: string;
  amount: number;
  className: string;
}

export default function TotalCard({
  title,
  amount,
  className
}: TotalCardProps) {
  return (
    <Card className={cn("border-border/60 shadow-sm p-1", className)}>
      <CardContent className="p-4">
        <p className="text-xs font-medium text-muted-foreground">
          {title}
        </p>

        <p className="mt-1 text-md font-semibold tracking-tight">
          ${amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </CardContent>
    </Card>
  );
}
