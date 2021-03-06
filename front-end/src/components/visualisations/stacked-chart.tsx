import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Margin,
  AxisDomain,
  BarProps,
  ScaleType,
  AxisInterval,
  LabelProps,
  ResponsiveContainer,
  TickFormatterFunction,
  Legend,
} from "recharts";

interface Props extends BarProps {
  margin?: Partial<Margin>;
  fill?: string;
  yKeys: Array<string>;
  yScale?: ScaleType;
  yLabel?: LabelProps;
  yDomain: [AxisDomain, AxisDomain];
  yTicks?: Array<number>;
  xInterval?: AxisInterval;
  xTicks?: Array<string>;
  xTickSize?: number;
  xTickMargin?: number;
  Tick?: any;
  yTickFormatter?: TickFormatterFunction;
  xTickFormatter?: TickFormatterFunction;
  dataKey: string;
  Heading: {
    text: string;
    className: string;
    level: string;
  };
}

const StackedBarGraph: React.FC<Props> = ({
  data,
  margin,
  dataKey,
  xInterval,
  yTicks,
  xTicks,
  xTickSize,
  xTickMargin,
  Tick,
  yKeys,
  yScale,
  yTickFormatter,
  xTickFormatter,
  yDomain,
  Heading,
}) => {
  const HeadingTag: any = Heading.level || "h3";
  const fills: Array<string | undefined> = [
    "#0077ff",
    "#002957",
    "#008568",
    "#e69f00",
    "#cc79a7",
    "#eee12f",
  ];

  return (
    <>
      <HeadingTag className={`bar-chart-title ${Heading.className}`}>
        {Heading.text}
      </HeadingTag>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={dataKey}
            ticks={xTicks}
            interval={xInterval}
            tickSize={xTickSize}
            tickMargin={xTickMargin}
            tick={
              Tick && <Tick formatFunction={xTickFormatter && xTickFormatter} />
            }
          ></XAxis>
          <YAxis
            domain={yDomain}
            ticks={yTicks}
            tickFormatter={yTickFormatter}
            scale={yScale}
          />
          <Tooltip />

          <Legend wrapperStyle={{ bottom: "-10px" }} />
          {yKeys.map((key: string, i: number) => (
            <Bar dataKey={key} key={i} fill={fills[i % yKeys.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default StackedBarGraph;
