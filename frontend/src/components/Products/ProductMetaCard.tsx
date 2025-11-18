import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import type { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  colorScheme?: "blue" | "green" | "red";
}

const ProductMetaCard = ({
  title,
  value,
  description,
  icon: Icon,
  colorScheme = "blue",
}: CardProps) => {
  const colorClasses = {
    blue: {
      card: "border-blue-200 bg-blue-50",
      title: "text-blue-900",
      icon: "text-blue-600",
      description: "text-blue-700",
      value: "text-blue-900",
    },
    green: {
      card: "border-green-200 bg-green-50",
      title: "text-green-900",
      icon: "text-green-600",
      description: "text-green-700",
      value: "text-green-900",
    },
    red: {
      card: "border-red-200 bg-red-50",
      title: "text-red-900",
      icon: "text-red-600",
      description: "text-red-700",
      value: "text-red-900",
    },
  };

  const colors = colorClasses[colorScheme];

  return (
    <Card className={colors.card}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`text-2xl font-bold ${colors.title}`}>
            {title}
          </CardTitle>
          <Icon className={`h-8 w-8 ${colors.icon}`} />
        </div>
        <CardDescription className={colors.description}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className={`text-5xl font-bold ${colors.value}`}>{value}</p>
      </CardContent>
    </Card>
  );
};

export default ProductMetaCard;
