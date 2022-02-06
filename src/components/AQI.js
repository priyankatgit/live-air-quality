import { Row, Col } from "antd";
import { useState, useEffect } from "react";
import aqiDataEmitter from "../service/AQIDataService";
import AQIList from "./AQIList";
import AQIChart from "./AQIChart";

const AQI = () => {
  let [aqiData, setAqiData] = useState([]);
  let [historicalData, setHistoricalData] = useState([]);

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

  const getAQIDataByCity = (city) => {
    let data = historicalData.filter((item) => item.city === city);
    data = data.sort((a, b) => a.updatedOn - b.updatedOn);
    return data;
  };

  useEffect(() => {
    let aqiDataDict = {};

    aqiDataEmitter((data) => {
      data.forEach(({ city, aqi }) => {
        aqiDataDict[city] = {
          key: city,
          city,
          aqi: +aqi.toFixed(2),
          updatedOn: Number(new Date()),
          //tempDate: moment(new Date()).format("mm:ss"),
          category: getAQICategory(+aqi.toFixed(0)),
        };
      });

      const newAQIData = Object.values(aqiDataDict);
      setAqiData(newAQIData);

      //TODO: Check performance for merging historical data
      setHistoricalData((prevState) => [...prevState, ...newAQIData]);
    });
  }, []);

  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <AQIList data={aqiData} onPastAQIView={getAQIDataByCity} />
        </Col>
        <Col span={12} style={{ backgroundColor: "#fff" }}>
          <AQIChart data={historicalData} />
        </Col>
      </Row>
    </>
  );
};

export default AQI;
