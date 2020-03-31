export interface ColumnEntry {
  displayName?: string;
  rawName: string;
}

export interface Row {
  id: string;
  data: {
    [key: string]: string | number | Date | null;
  };
}
