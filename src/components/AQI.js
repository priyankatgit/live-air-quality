import { Row, Col } from "antd";
import { useState, useEffect } from "react";
import aqiDataEmitter from "../service/AQIDataService";
import AQIListNew from "./AQIList";
import AQIChart from "./AQIChart";

const AQI = () => {
  const getAQICategory = (aqi) => {
    if (aqi >= 0 && aqi <= 50) {
      return { color: "green", colorName: "#389e0d", name: "Good" };
    } else if (aqi >= 51 && aqi <= 100) {
      return { color: "lime", colorName: "#7cb305", name: "Satisfactory" };
    } else if (aqi >= 101 && aqi <= 200) {
      return { color: "warning", colorName: "#faad14", name: "Moderate" };
    } else if (aqi >= 201 && aqi <= 300) {
      return { color: "magenta", colorName: "#c41d7f", name: "Poor" };
    } else if (aqi >= 301 && aqi <= 400) {
      return { color: "red", colorName: "#cf1322", name: "Very Poor" };
    } else {
      return { color: "#f50", colorName: "#f50", name: "Severe" };
    }
  };

  let [aqiData, setAqiData] = useState([]);
  let [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    let aqiDataDict = {};

    console.log("🚀 ~ file: AQIList.js ~ line 80 ~ useEffect ~ useEffect");

    aqiDataEmitter((data) => {
      data.forEach(({ city, aqi }) => {
        aqiDataDict[city] = {
          city,
          aqi: +aqi.toFixed(2),
          updatedOn: Number(new Date()),
          category: getAQICategory(+aqi.toFixed(0)),
        };
      });

      aqiData = Object.values(aqiDataDict);
      //   console.log("historicalData", historicalData);
      setAqiData(aqiData);

      //TODO: Check performance for merging historical data
      // Added temporary max historical data merging limit to keep performance manageable.
      if (historicalData.length <= 1000) {
        historicalData = [...historicalData, ...aqiData];
        setHistoricalData(historicalData);
      }
    });
  }, []);

  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <AQIListNew data={aqiData} />
        </Col>
        <Col span={12}>
          <AQIChart data={historicalData} />
        </Col>
      </Row>
    </>
  );
};

export default AQI;
