import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CreateScript,
  DeleteScriptByID,
  GetAllScript,
  GetScriptbyCategory,
  GetScriptByID,
  RunScript,
  UpdateScript,
} from "./ScriptApi";

const initialState: any = {
  Scripts: [],
  Script: [],
  Active_Role: "",
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
    }
  );
};

export const CreateScripts: any = AsyncFunctionThunk(
  "CreateScript",
  CreateScript
);
export const GetAllScripts: any = AsyncFunctionThunk(
  "GetAllScripts",
  GetAllScript
);
export const GetScriptByIDs: any = AsyncFunctionThunk(
  "GetScriptByIDs",
  GetScriptByID
);
export const RunScripts: any = AsyncFunctionThunk("RunScripts", RunScript);
export const DeleteScriptByIDs: any = AsyncFunctionThunk(
  "DeleteScriptByIDs",
  DeleteScriptByID
);
export const UpdateScripts: any = AsyncFunctionThunk(
  "UpdateScripts",
  UpdateScript
);
export const GetScriptbyCategorys: any = AsyncFunctionThunk(
  "GetScriptbyCategorys",
  GetScriptbyCategory
);

const ScriptSlice = createSlice({
  name: "ScriptSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
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
      .addCase(GetAllScripts.fulfilled, (state, action) => {
        state.Scripts = action.payload;
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
        state.Scripts = action.payload;
        state.loading = false;
      })
      .addCase(GetScriptbyCategorys.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetScriptbyCategorys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetScriptByIDs.fulfilled, (state, action) => {
        state.Script = action.payload;
        state.loading = false;
      })
      .addCase(GetScriptByIDs.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetScriptByIDs.rejected, (state, action) => {
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

export const { setLoading } = ScriptSlice.actions;

export default ScriptSlice.reducer;
