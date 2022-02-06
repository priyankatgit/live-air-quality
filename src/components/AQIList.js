import { Table, Tag } from "antd";
import moment from "moment";

const AQIList = ({ data }) => {
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
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      size="small"
    />
  );
};

export default AQIList;
