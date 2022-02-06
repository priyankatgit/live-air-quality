import React from "react";
import { Line } from "@ant-design/plots";

const AQIChart = ({ data }) => {
  const config = {
    data,
    xField: "updatedOn",
    yField: "aqi",
    seriesField: "city",
    xAxis: {
      label: {
        formatter: (updatedOn) => {
          // updatedOn is in millisecond and added country wise timezone to show local time on chart.
          updatedOn =
            Number(updatedOn) + new Date().getTimezoneOffset() * 60000;

          const seconds = Math.floor((updatedOn / 1000) % 60);
          const minutes = Math.floor((updatedOn / 1000 / 60) % 60);
          //const hours = Math.floor((v / 1000 / 60 / 60) % 24);

          const formattedTime = [
            minutes.toString().padStart(2, "0"),
            seconds.toString().padStart(2, "0"),
          ].join(":");
          return formattedTime;
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v) => {
          let aqi = +Number(v).toFixed(0);
          if (aqi >= 0 && aqi <= 50) return 50;
          else if (aqi >= 51 && aqi <= 100) return 100;
          else if (aqi >= 101 && aqi <= 200) return 200;
          else if (aqi >= 201 && aqi <= 300) return 300;
          else if (aqi >= 301 && aqi <= 400) return 400;
          else return 500;
        },
      },
    },
    legend: {
      position: "top",
    },
    smooth: true,
  };

  return <Line {...config} />;
};

export default AQIChart;
