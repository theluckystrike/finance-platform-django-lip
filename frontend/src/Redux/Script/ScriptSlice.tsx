import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateScript, GetAllScript} from "./ScriptApi";

const initialState:any = {
  Scripts: [],
  Script: [],
  Active_Role: '',
  page: 1,
  loading: false,
  error: null,
};

const AsyncFunctionThunk = (name:any, apiFunction:any) => {
  return createAsyncThunk(`Script/${name}`, async (data, { rejectWithValue }) => {
    try {
      const response = await apiFunction(data);
      console.log(response.data, "dada");
      return response.data;
    } catch (error:any) {


      if (error.response && error.response.data) {

        return rejectWithValue(error.response.data);
      }

      return rejectWithValue({ error: error.message });
      throw error;
    }
  });
};
 
export const CreateScripts:any = AsyncFunctionThunk('CreateScript', CreateScript);
export const GetAllScripts:any = AsyncFunctionThunk('GetAllScripts', GetAllScript);
 


const ScriptSlice = createSlice({
  name: 'ScriptSlice',
  initialState,
  reducers: {
   
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

  },
});

 

export default ScriptSlice.reducer;