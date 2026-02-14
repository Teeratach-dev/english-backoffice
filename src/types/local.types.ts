export interface LocalUnit {
  _id: string;
  name: string;
  isActive: boolean;
  sequence?: number;
}

export interface LocalTopic {
  _id: string;
  name: string;
  isActive: boolean;
  sequence?: number;
}

export interface LocalSessionGroup {
  _id: string;
  name: string;
  isActive: boolean;
  sequence?: number;
}

export interface LocalSession {
  _id: string;
  name: string;
  type: string;
  cefrLevel: string;
  isActive: boolean;
  sequence?: number;
}
