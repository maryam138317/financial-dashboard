import { Card, CardContent } from "../ui/card";

interface TotalCardProps {
  title: string;
  amount: number;
}

export default function TotalCard({
  title,
  amount,
}: TotalCardProps) {
  return (
    <Card className="border-border/60 shadow-sm p-1">
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
