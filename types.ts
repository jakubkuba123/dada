
export interface Chicken {
  id: string;
  name: string;
  breed: string;
  hatchDate: string;
  status: 'healthy' | 'sick' | 'clucking';
  notes?: string;
  medication?: string;
  sicknessStartDate?: string;
  cluckingStartDate?: string;
  expectedHatchDate?: string;
}

export interface EggRecord {
  id: string;
  date: string;
  normalCount: number;
  extraLargeCount: number;
  extraSmallCount: number;
}

export interface FeedRecord {
  id: string;
  date: string;
  amountKg: number;
  costCzk: number;
  waterLiters: number;
  durationDays?: number;
}

export interface Customer {
  id: string;
  name: string;
  totalPaid: number;
  eggsTaken: number;
}

export interface Sale {
  id: string;
  customerId: string;
  date: string;
  eggCount: number;
  priceCzk: number;
}

export interface Task {
  id: string;
  type: 'cleaning' | 'bedding' | 'custom';
  scheduledDate: string;
  completed: boolean;
  title: string;
}

export interface AppState {
  chickens: Chicken[];
  eggRecords: EggRecord[];
  feedRecords: FeedRecord[];
  customers: Customer[];
  sales: Sale[];
  tasks: Task[];
  eggStock: {
    normal: number;
    extraLarge: number;
    extraSmall: number;
  };
}
