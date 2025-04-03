import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  Createreport,
  Createreportschedules,
  GetSatusreportByID,
  DeleteReportsByID,
  GetAllreport,
  GetreportByID,
  mergereport,
  Updatereport,
  UpdateReports,
  RemoveScriptFromReport,
  RemoveSummaryFromReport,
  GetReportSchedulesByID,
  DeleteReportEmailByID,
} from './Api';
export interface ReportState {
  reports: any[]; // You can replace `any` with a more specific type if available
  count: number;
  report: {
    id: number,
    name: string;
    scripts: [];
    latest_pdf: string | null;
    summaries?: [];
    last_updated?: string;
  }; // Same here, replace `any` with a specific type if possible
  schedules: any[];
  Active_Role: string;
  page: number;
  reportStatus: string;
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  reports: [],
  count: 0,
  report: {
    id: 0,
    name: '',
    scripts: [],
    latest_pdf: null,
    summaries: [],
  },
  schedules: [],
  reportStatus: '',
  Active_Role: '',
  page: 1,
  loading: false,
  error: null,
};

const AsyncFunctionThunk = (name: any, apiFunction: any) => {
  return createAsyncThunk(
    `report/${name}`,
    async (data, { rejectWithValue }) => {
      try {
        const response = await apiFunction(data);
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        }
        return rejectWithValue({ error: error.message });
        throw error;
      }
    },
  );
};

export const Createreports: any = AsyncFunctionThunk(
  'Createreport',
  Createreport,
);
export const Updatereports: any = AsyncFunctionThunk(
  'Updatereports',
  Updatereport,
);
export const RemoveScriptFromReports: any = AsyncFunctionThunk(
    'RemoveScriptFromReports',
    RemoveScriptFromReport,
  );
  export const RemoveSummaryFromReports: any = AsyncFunctionThunk(
    'RemoveSummaryFromReports',
    RemoveSummaryFromReport,
  );
export const GetAllreports: any = AsyncFunctionThunk(
  'GetAllreports',
  GetAllreport,
);
export const GetreportByIDs: any = AsyncFunctionThunk(
  'GetreportByIDs',
  GetreportByID,
);
export const GetReportSchedulesByIDs: any = AsyncFunctionThunk(
  'GetReportSchedulesByIDs',
  GetReportSchedulesByID,
);
export const DeleteReportEmailByIDs: any = AsyncFunctionThunk(
  'DeleteReportEmailByIDs',
  DeleteReportEmailByID,
);
export const GetSatusreportByIDs: any = AsyncFunctionThunk(
  'GetSatusreportByIDs',
  GetSatusreportByID,
);
export const Createschedules: any = AsyncFunctionThunk(
  'Createschedules',
  Createreportschedules,
);
export const DeleteReportsByIDs: any = AsyncFunctionThunk(
  'DeleteReportsByIDs',
  DeleteReportsByID,
);
export const UpdateReportss: any = AsyncFunctionThunk(
  'UpdateReportss',
  UpdateReports,
);
export const mergereports: any = AsyncFunctionThunk(
  'mergereports',
  mergereport,
);

const reportSlice = createSlice({
  name: 'reportSlice',
  initialState,
  reducers: {
    UpdateReportss,
  },
  extraReducers: (builder) => {
    builder
      .addCase(Createreports.fulfilled, (state, action) => {
        state.report = action.payload;
        state.loading = false;
      })
      .addCase(Createreports.pending, (state) => {
        state.loading = true;
      })
      .addCase(Createreports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetAllreports.fulfilled, (state, action) => {
        state.reports = action.payload.results;
        state.count = action.payload.count;
        state.loading = false;
      })
      .addCase(GetAllreports.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAllreports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.reports = [];
      })
      .addCase(GetSatusreportByIDs.fulfilled, (state, action) => {
        state.reportStatus = action.payload.status;
        state.loading = false;
      })
      .addCase(GetSatusreportByIDs.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetSatusreportByIDs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetreportByIDs.fulfilled, (state, action) => {
        state.report = action.payload;
        state.loading = false;
      })
      .addCase(GetreportByIDs.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetreportByIDs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetReportSchedulesByIDs.fulfilled, (state, action) => {
        state.schedules = action.payload;
        state.loading = false;
      })
      .addCase(GetReportSchedulesByIDs.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetReportSchedulesByIDs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(Updatereports.fulfilled, (state, action) => {
        state.report = action.payload;
        state.loading = false;
      })

      .addCase(Updatereports.pending, (state) => {
        state.loading = true;
      })
      .addCase(Updatereports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(DeleteReportsByIDs.fulfilled, (state, action) => {
        // state.Script = action.payload;
        state.loading = false;
      })
      .addCase(DeleteReportsByIDs.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteReportsByIDs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(UpdateReportss.fulfilled, (state, action) => {
        // state.Script = action.payload;
        state.loading = false;
      })
      .addCase(UpdateReportss.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateReportss.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(mergereports.fulfilled, (state, action) => {
        // state.Script = action.payload;
        state.loading = false;
      })
      .addCase(mergereports.pending, (state) => {
        state.loading = true;
      })
      .addCase(mergereports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reportSlice.reducer;
