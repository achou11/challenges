import * as React from "react";
import styled from "styled-components";
import orderBy from "lodash.orderby";

import colors from "./colors";
import { ColumnEntry, Row, SortOrder } from "./types";
import Icon from "./Icon";
import Loading from "./Loading";

const TableContainer = styled.div<{ columns: number; maxHeight?: number }>`
  font-family: sans-serif;
  border: 1px solid ${colors.border.light};
  border-radius: 4px;
  box-shadow: 1px 1px 5px 1px ${colors.border.light};
  padding: 0 8px;
  min-width: ${(props) => `${props.columns * 100}px`};
  max-height: ${(props) => `${props.maxHeight}px`};
  overflow: auto;
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin: -1px 0;
`;

const StickyTableHead = styled.thead`
  position: sticky;
  top: 0;
  box-shadow: inset 0 -1px ${colors.border.light};
  background-color: white;
`;

const StyledTableRow = styled.tr`
  color: ${colors.border.light};
`;

const StyledColumnHeader = styled.th`
  border-width: 1px 0;
  border-style: solid;
  border-color: ${colors.border.light};
  cursor: pointer;
`;

const SortButton = styled.button<{ isActive: boolean }>`
  cursor: pointer;
  border: 0;
  background-color: transparent;
  padding: 8px;
  font-size: 0.5em;
  display: flex;
  width: 100%;
  align-items: center;
  color: ${(props) => (props.isActive ? colors.text.light : colors.text.dark)};

  & .icon-container {
    visibility: ${(props) => (props.isActive ? "visible" : "hidden")};
  }
  &:hover .icon-container {
    visibility: visible;
  }

  & * {
    margin: 0;
  }
  & > * + * {
    margin-inline-start: 4px;
  }
`;

const StyledRowCell = styled.td`
  color: ${colors.text.medium};
  border-width: 1px 0;
  border-color: ${colors.border.light};
  border-style: solid;
  padding: 16px 8px;
  &.no-value {
    font-style: italic;
    color: ${colors.text.disabled}
  }
`;

const determineChevronDirection = (
  isActiveField: boolean,
  currentOrder: SortOrder,
  interactionOccurred: boolean
) => {
  if (!interactionOccurred && isActiveField) {
    return "down";
  }
  if (isActiveField) {
    return currentOrder === "asc" ? "up" : "down";
  }
  return "up";
};

interface Props<T> {
  emptyValue?: string;
  initialSortField: string;
  isLoading?: boolean;
  maxHeight?: number;
  rows: T[];
  columns: ColumnEntry[];
}

const columnHasCustomSort = (columns: ColumnEntry[], field: string) => {
  const column = columns.find(c => c.rawName === field)
  return column && column.sort
}

const calculateDisplayedRows = ({ rows, columns, sortField, sortOrder }: {
  rows: Row[],
  columns: ColumnEntry[],
  sortField: string | null,
  sortOrder: SortOrder,
}): Row[] => {
  if (!sortField) return rows

  if (columnHasCustomSort(columns, sortField)) {
    const column = columns.find(c => c.rawName === sortField)
    if (column && column.sort) {
      return column.sort(rows, sortField, sortOrder)
    }
  }

  return orderBy(rows, [`data.${sortField}`], [sortOrder])
}

const Table = ({
  columns,
  emptyValue,
  initialSortField,
  isLoading,
  maxHeight,
  rows,
}: Props<Row>) => {
  const [sortField, setSortField] = React.useState<string | null>(
    initialSortField
  );
  const [sortOrder, setOrder] = React.useState<SortOrder>("asc");
  const [interactionOccurred, setInteractionOccurred] = React.useState(false);

  const setOrdering = (fieldName: string) => {
    if (!interactionOccurred) {
      setInteractionOccurred(true);
    }

    if (fieldName === sortField) {
      setOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(fieldName);
      setOrder("asc");
    }
  };

  return (
    <TableContainer columns={columns.length} maxHeight={!isLoading ? maxHeight : undefined}>
      {isLoading ? (
        <Loading />
      ) : (
          <StyledTable>
            <StickyTableHead>
              <tr>
                {columns.map((col) => (
                  <StyledColumnHeader key={col.rawName} scope="col">
                    <SortButton
                      isActive={interactionOccurred && col.rawName === sortField}
                      onClick={(event) => setOrdering(col.rawName)}
                    >
                      <h1>{col.displayName || col.rawName}</h1>
                      <div className="icon-container">
                        <Icon
                          direction={determineChevronDirection(
                            col.rawName === sortField,
                            sortOrder,
                            interactionOccurred
                          )}
                        />
                      </div>
                    </SortButton>
                  </StyledColumnHeader>
                ))}
              </tr>
            </StickyTableHead>
            <tbody>
              {calculateDisplayedRows({ rows, columns, sortField, sortOrder }).map((row) => (
                <StyledTableRow key={row.id}>
                  {Object.entries(row.data).map(([field, value]) => (
                    <StyledRowCell
                      key={`${row.id}-${field}`}
                      className={!value ? "no-value" : undefined}
                    >
                      {value || emptyValue}
                    </StyledRowCell>
                  ))}
                </StyledTableRow>
              ))}
            </tbody>
          </StyledTable>
        )}
    </TableContainer>
  );
};

Table.defaultProps = {
  emptyValue: "N/A",
  isLoading: false,
  maxHeight: 500,
};

export default Table;
