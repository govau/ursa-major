import React, { useState, useLayoutEffect } from "react";
import { useFetch } from "../hooks/use-fetch";
import { useMediaQuery } from "react-responsive";
import { AxisDomain } from "recharts";
import { number } from "prop-types";
import LineGraph from "../visualisations/line-chart";
import scaleFormatter from "../visualisations/y-axis-formatter";
import formatDate from "../visualisations/date-tick-formatter";

interface Props {}

const UniqueUsersLineGraph: React.FC<Props> = (pro: any) => {
  const graphData = useFetch({
    initialState: "",
    query: "{total_unique {total_unique_users_scale visit_date}}",
  });

  const isTabletOrMobile: Boolean = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const initialState: any = {};
  const [state, setstate] = useState(initialState);

  // use this to generate data for mobile view
  useLayoutEffect((): any => {
    let count: number = 0;
    let datePoint: string = "";
    let mobileData: Array<Object> = [];
    let xTicksMobile: Array<Object> = [];
    let xTicksDesktop: Array<Object> = [];
    var i: number = 0;

    if (!graphData.loading) {
      for (i = 0; i < graphData.data.total_unique.length; i++) {
        count =
          +graphData.data.total_unique[i].total_unique_users_scale + +count;
        if (i % 13 === 0) {
          datePoint = graphData.data.total_unique[i].visit_date;
          i % 2 && xTicksMobile.push(datePoint);
          mobileData.push({
            total_unique_users_scale: count,
            visit_date: datePoint,
          });
          count = 0;
        }

        if (i === graphData.data.total_unique.length - 1) {
          datePoint = graphData.data.total_unique[i].visit_date;
          xTicksMobile.push(datePoint);
          mobileData.push({
            total_unique_users_scale: count,
            visit_date: datePoint,
          });
          count = 0;
        }
      }

      [15, 30, 45, 60, 75, 89].map((index) => {
        xTicksDesktop.push(graphData.data.total_unique[index].visit_date);
      });
    }
    setstate({ data: mobileData, xTicksMobile, xTicksDesktop });
  }, [graphData.loading]);

  //REFACTOR this should be automatic based off the data
  const yDomain: [AxisDomain, AxisDomain] = isTabletOrMobile
    ? [50, 350]
    : [0, 30];

  const props = {
    data: isTabletOrMobile ? state.data : graphData.data.total_unique,
    yKey: "total_unique_users_scale",
    x_key: "visit_date",
    yDomain,
    type: number,
    yTicks: isTabletOrMobile ? [100, 200, 300] : [10, 20, 30, 40],
    xTicks: isTabletOrMobile ? state.xTicksMobile : state.xTicksDesktop,
    xTickSize: 10,
    xTickMargin: 5,
    Heading: {
      text: "Total unique users, last 90 days",
      className: "au-display-md bar-chart-title",
      level: "h3",
    },
    fill: "#0077ff",
    dot: isTabletOrMobile ? true : false,
    yTickFormatter: scaleFormatter,
    xTickFormatter: formatDate,
    isTabletOrMobile,
  };

  return (
    <div className="container-fluid">
      {!graphData.loading && <LineGraph {...props} />}
    </div>
  );
};

export default UniqueUsersLineGraph;
