import type { Product } from "@/types/index.types";
import { Loader } from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, YAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "../ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ChartProps {
  data: Product[];
  isLoading: boolean;
}

const ProductChart = ({ data, isLoading }: ChartProps) => {
  if (isLoading) {
    return <Loader className="animate-spin" />;
  }

  const monthMap: { [month: string]: number } = {};

  for (const product of data) {
    const month = new Date(product.createdAt).toLocaleString("default", {
      month: "short",
      day: "2-digit",
    });
    monthMap[month] = (monthMap[month] || 0) + 1;
  }

  const chartData = Object.entries(monthMap).map(([month, count]) => ({
    month,
    count,
  }));

  const chartConfig = {
    month: {
      label: "Date",
      color: "#2563eb",
    },
    count: {
      label: "Count",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  return (
    <Card className=" p-3 mt-10">
      <CardHeader>
        <CardTitle className="mt-4">Product Created Per Day</CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <AreaChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              fill="#60a5fa"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ProductChart;
