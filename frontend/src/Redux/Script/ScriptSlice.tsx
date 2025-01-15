import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  CreateScript,
  DeleteScriptByID,
  GetAllScript,
  GetSatusScriptByID,
  GetScriptbyCategory,
  GetScriptByID,
  RunScript,
  UpdateScript,
} from './ScriptApi';
import { act } from 'react';

export interface ScriptState {
  scripts: any[]; // You can specify a more specific type if you know the structure of scripts
  count: number;
  Script: any; // Same as above, specify the correct type if known
  ScriptStatus: any;
  Active_Role: string;
  page: number;
  loading: boolean;
  error: any; // You can refine this to be more specific if you know the error type
}

const initialState: ScriptState = {
  scripts: [],
  count: 0,
  Script: {},
  ScriptStatus: {},
  Active_Role: '',
  page: 1,
  loading: false,
  error: null,
};

const AsyncFunctionThunk = (name: any, apiFunction: any) => {
  return createAsyncThunk(
    `Script/${name}`,
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

export const CreateScripts: any = AsyncFunctionThunk(
  'CreateScript',
  CreateScript,
);
export const GetAllScripts: any = AsyncFunctionThunk(
  'GetAllScripts',
  GetAllScript,
);
export const getScriptByIDAction: any = AsyncFunctionThunk(
  'GetScriptByID',
  GetScriptByID,
);
export const RunScripts: any = AsyncFunctionThunk('RunScripts', RunScript);
export const DeleteScriptByIDs: any = AsyncFunctionThunk(
  'DeleteScriptByIDs',
  DeleteScriptByID,
);
export const UpdateScripts: any = AsyncFunctionThunk(
  'UpdateScripts',
  UpdateScript,
);
export const GetScriptbyCategorys: any = AsyncFunctionThunk(
  'GetScriptbyCategorys',
  GetScriptbyCategory,
);
export const GetSatusScriptByIDs: any = AsyncFunctionThunk(
  'GetSatusScriptByIDs',
  GetSatusScriptByID,
);

const ScriptSlice = createSlice({
  name: 'ScriptSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CreateScripts.fulfilled, (state, action) => {
        state.Script = action.payload;
        state.loading = false;
      })
      .addCase(CreateScripts.pending, (state) => {
        state.loading = true;
      })
      .addCase(CreateScripts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetSatusScriptByIDs.fulfilled, (state, action) => {
        state.ScriptStatus = action.payload;
        state.loading = false;
      })
      .addCase(GetSatusScriptByIDs.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetSatusScriptByIDs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetAllScripts.fulfilled, (state, action) => {
        state.scripts = action.payload.results;
        state.count = action.payload.count;
        state.loading = false;
      })
      .addCase(GetAllScripts.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAllScripts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetScriptbyCategorys.fulfilled, (state, action) => {
        state.scripts = action.payload.results;
        state.count = action.payload.count;
        state.loading = false;
      })
      .addCase(GetScriptbyCategorys.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetScriptbyCategorys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getScriptByIDAction.fulfilled, (state, action) => {
        state.Script = action.payload;
        state.loading = false;
      })
      .addCase(getScriptByIDAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getScriptByIDAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(RunScripts.fulfilled, (state, action) => {
        // state.Script = action.payload;
        state.loading = false;
      })
      .addCase(RunScripts.pending, (state) => {
        state.loading = true;
      })
      .addCase(RunScripts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(DeleteScriptByIDs.fulfilled, (state, action) => {
        state.Script = action.payload;
        state.loading = false;
      })
      .addCase(DeleteScriptByIDs.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteScriptByIDs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(UpdateScripts.fulfilled, (state, action) => {
        state.Script = action.payload;
        state.loading = false;
      })
      .addCase(UpdateScripts.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateScripts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ScriptSlice.reducer;
