export type SortOrder = 'asc' | 'desc'

export interface ColumnEntry {
  displayName?: string;
  rawName: string;
  sort?: (rows: Row[], field: string, direction: SortOrder) => Row[];
}

export interface Row {
  id: string;
  data: {
    [key: string]: string | number | Date | null;
  };
}
