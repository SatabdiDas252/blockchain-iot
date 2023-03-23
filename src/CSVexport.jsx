import React from "react";
import { CSVLink } from "react-csv";

const CSVexport = ({ data, headers }) => {
  const csvLink = {
    fileName: "file.csv",
    headers,
    data,
  };
  return (
    <div>
      <CSVLink data={data} headers={headers}>
        Export Results
      </CSVLink>
    </div>
  );
};

export default CSVexport;
