import React, { useState } from "react";
import { Table, Tag } from "antd";
import moment from "moment";
import { Modal, Button } from "antd";

const AQIList = ({ data, onPastAQIView }) => {
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [historyModelTitle, setHistoryModelTitle] = useState("");

  const [historyData, setHistoryData] = useState([]);

  const historyColumns = [
    {
      title: "Current AQI",
      key: "aqi",
      dataIndex: "aqi",
      render: (text, record) => {
        const { color, colorName, name: categoryName } = record.category;
        return (
          <>
            <span style={{ float: "right" }}>
              <Tag color={color} key={categoryName}>
                {categoryName.toUpperCase()}
              </Tag>
            </span>

            <span style={{ color: colorName }}>{text}</span>
          </>
        );
      },
      sorter: (a, b) => a.aqi - b.aqi,
    },
    {
      title: "Last updated",
      dataIndex: "relativeTime",
      key: "relativeTime",
      render: (text, record) => moment(Number(record.updatedOn)).fromNow(),
    },
  ];

  const openHistoryModel = ({ city }) => {
    setHistoryModelTitle(city);
    setIsHistoryModalVisible(true);

    const cityHistoryData = onPastAQIView(city);
    setHistoryData(cityHistoryData);
  };

  const columns = [
    {
      title: "City",
      key: "city",
      dataIndex: "city",
    },
    {
      title: "Current AQI",
      key: "aqi",
      dataIndex: "aqi",
      render: (text, record) => {
        const { color, colorName, name: categoryName } = record.category;
        return (
          <>
            <span style={{ float: "right" }}>
              <Tag color={color} key={categoryName}>
                {categoryName.toUpperCase()}
              </Tag>
            </span>

            <span style={{ color: colorName }}>{text}</span>
          </>
        );
      },
      sorter: (a, b) => a.aqi - b.aqi,
      filters: [
        {
          text: "Good",
          value: "Good",
        },
        {
          text: "Satisfactory",
          value: "Satisfactory",
        },
        {
          text: "Moderate",
          value: "Moderate",
        },
        {
          text: "Poor",
          value: "Poor",
        },
        {
          text: "Very Poor",
          value: "Very Poor",
        },
        {
          text: "Severe",
          value: "Severe",
        },
      ],
      onFilter: (value, record) => record.category.name.indexOf(value) === 0,
    },
    {
      title: "Last updated",
      dataIndex: "relativeTime",
      key: "relativeTime",
      render: (text, record) => moment(Number(record.updatedOn)).fromNow(),
    },
    {
      title: "",
      render: (text, record) => (
        <a href="javascript:;" onClick={() => openHistoryModel(record)}>
          View past AQI
        </a>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
      />
      <Modal
        title={`AQI Data - ${historyModelTitle}`}
        visible={isHistoryModalVisible}
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setIsHistoryModalVisible(false)}
      >
        <Table columns={historyColumns} dataSource={historyData} size="small" />
      </Modal>
    </>
  );
};

export default AQIList;
