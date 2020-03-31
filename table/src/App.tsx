import * as React from "react";
import styled from "styled-components";

import { PeopleResponse, Result } from "./types";
import { customDateSort } from './customSorts'
import Table from "./Table";
import colors, { palette } from "./Table/colors";

const fetchPeople = async () => {
  const response = await fetch("https://swapi.co/api/people/");
  return response.json();
};

const fieldMappings: { [key: string]: string } = {
  name: "Name",
  height: "Height",
  mass: "Mass",
  hair_color: "Hair Color",
  eye_color: "Eye Color",
  created: "Created",
  edited: "Edited",
};

const numberFields = ["height", "mass"];
const dateFields = ["created", "edited"];

const convertValue = (value: any, field: string) => {
  if (value === "n/a") return null;
  if (dateFields.includes(field))
    return new Date(value).toLocaleDateString();
  if (numberFields.includes(field)) return Number(value);

  return value;
};

const getDesiredRowData = (row: Result, idField: string) => {
  const idValue: string = row[idField] as string;

  let result: {
    id: string;
    data: {
      [key: string]: string | number | Date | null;
    };
  } = { id: idValue, data: {} };

  Object.keys(fieldMappings).forEach((field) => {
    const value = row[field];
    const newValue = convertValue(value, field);
    result.data[field] = newValue;
  });

  return result;
};

const getColumns = (entry: any) =>
  Object.keys(entry)
    .filter((column) => !!fieldMappings[column])
    .map((rawColumnName) => ({
      rawName: rawColumnName,
      displayName: fieldMappings[rawColumnName] || undefined,
      // For the purposes of this demo, we provide a custom sorting function for the date fields
      sort: dateFields.includes(rawColumnName) ? customDateSort : undefined,
    }));

const Container = styled.main`
  padding: 24px;
  & > * + * {
    margin-top: 32px;
  }
`;

const FetchButton = styled.button<{ disabled: boolean }>`
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  color: ${colors.text.light};
  border: 1px solid ${colors.border.light};
  background-color: #fff;
  font-size: 20px;
  padding: 12px;
  border-radius: 4px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  ${(props) =>
    !props.disabled
      ? `&:hover {
    color: white;
    border: 1px solid ${colors.border.light};
    background-color: ${palette.lightPurple};
  }`
      : ""}
`;

const App = () => {
  const [data, setData] = React.useState<Result[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const people: PeopleResponse = await fetchPeople();
      setData(people.results);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  const rowData = data.map((row) => getDesiredRowData(row, "name"));

  return (
    <Container>
      <FetchButton disabled={loading} onClick={fetchData}>
        Fetch data
      </FetchButton>
      {(data.length > 0 || loading) && (
        <Table
          isLoading={loading}
          initialSortField="name"
          rows={rowData}
          columns={getColumns(data[0] || {})}
        />
      )}
    </Container>
  );
};

export default App;
