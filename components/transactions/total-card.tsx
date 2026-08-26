import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface TotalCardProps {
  title: string;
  amount: number;
}

export default function TotalCard({
  title,
  amount,
}: TotalCardProps) {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-xl font-semibold tracking-tight">
          ${amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </CardContent>
    </Card>
  );
}
