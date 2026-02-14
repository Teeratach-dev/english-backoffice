export interface LocalUnit {
  _id: string;
  name: string;
  isActive: boolean;
  sequence: number;
  courseName?: string;
}

export interface LocalTopic {
  _id: string;
  name: string;
  isActive: boolean;
  sequence: number;
  unitName?: string;
}

export interface LocalSessionGroup {
  _id: string;
  name: string;
  isActive: boolean;
  sequence: number;
  topicName?: string;
}

export interface LocalSession {
  _id: string;
  name: string;
  type: string;
  cefrLevel: string;
  isActive: boolean;
  sequence: number;
  groupName?: string;
  sessionGroupName?: string;
}
