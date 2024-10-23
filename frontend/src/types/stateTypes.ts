 export interface ReportState {
    reports: any[];       // You can replace `any` with a more specific type if available
    report: any[];        // Same here, replace `any` with a specific type if possible
    Active_Role: string;
    page: number;
    loading: boolean;
    error: string | null;
  }