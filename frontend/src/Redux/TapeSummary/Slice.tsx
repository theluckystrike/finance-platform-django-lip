import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  Createsummery,
  GetSatussummeryByID,
  DeletesummariesByID,
  GetAllsummery,
  Updatesummaries,
  GetsummeryByID,
  mergesummery,
  Updatesummery,
} from './Api';

const initialState: any = {
  summerys: [],
  summery: [],
  summeryStatus: '',
  Active_Role: '',
  page: 1,
  loading: false,
  error: null,
};

const AsyncFunctionThunk = (name: any, apiFunction: any) => {
  return createAsyncThunk(
    `summery/${name}`,
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

export const Createsummerys: any = AsyncFunctionThunk(
  'Createsummery',
  Createsummery,
);
export const GetAllsummerys: any = AsyncFunctionThunk(
  'GetAllsummerys',
  GetAllsummery,
);
export const GetsummeryByIDs: any = AsyncFunctionThunk(
  'GetsummeryByIDs',
  GetsummeryByID,
);
export const GetSatussummeryByIDs: any = AsyncFunctionThunk(
  'GetSatussummeryByIDs',
  GetSatussummeryByID,
);
export const DeletesummariesByIDs: any = AsyncFunctionThunk(
  'DeletesummariesByIDs',
  DeletesummariesByID,
);
export const Updatesummeryss: any = AsyncFunctionThunk(
  'Updatesummeryss',
  Updatesummery,
);
export const Updatesummariess: any = AsyncFunctionThunk(
  'Updatesummariess',
  Updatesummaries,
);
export const mergesummerys: any = AsyncFunctionThunk(
  'mergesummerys',
  mergesummery,
);

const summerySlice = createSlice({
  name: 'summerySlice',
  initialState,
  reducers: {
    Updatesummeryss,
  },
  extraReducers: (builder) => {
    builder
      .addCase(Createsummerys.fulfilled, (state, action) => {
        state.summery = action.payload;
        state.loading = false;
      })
      .addCase(Createsummerys.pending, (state) => {
        state.loading = true;
      })
      .addCase(Createsummerys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetAllsummerys.fulfilled, (state, action) => {
        state.summerys = action.payload;
        state.loading = false;
      })
      .addCase(GetAllsummerys.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAllsummerys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetSatussummeryByIDs.fulfilled, (state, action) => {
        state.summeryStatus = action.payload;
        state.loading = false;
      })
      .addCase(GetSatussummeryByIDs.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetSatussummeryByIDs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetsummeryByIDs.fulfilled, (state, action) => {
        state.summery = action.payload;
        state.loading = false;
      })
      .addCase(GetsummeryByIDs.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetsummeryByIDs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(Updatesummariess.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(Updatesummariess.pending, (state) => {
        state.loading = true;
      })
      .addCase(Updatesummariess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(Updatesummeryss.fulfilled, (state, action) => {
        // state.Script = action.payload;
        state.loading = false;
      })
      .addCase(Updatesummeryss.pending, (state) => {
        state.loading = true;
      })
      .addCase(Updatesummeryss.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(mergesummerys.fulfilled, (state, action) => {
        // state.Script = action.payload;
        state.loading = false;
      })
      .addCase(mergesummerys.pending, (state) => {
        state.loading = true;
      })
      .addCase(mergesummerys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default summerySlice.reducer;
