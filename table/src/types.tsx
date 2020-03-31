export interface Person {
  name: string;
  height: number;
  mass: number;
  hair_color: string;
  eye_color: string;
  created: string;
  edited: string;
}

export interface Result extends Person {
  [key: string]: string | number | Date;
}

export interface PeopleResponse {
  count: number;
  next: string;
  previous: string | null;
  results: Result[];
}
