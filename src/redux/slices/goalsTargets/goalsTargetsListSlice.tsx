import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface GoalsTargetsListState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
  totalRecords: number;
}
const initialState: GoalsTargetsListState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {},
  totalRecords:0
}

export const listGoalsTargets = createAsyncThunk<any, { url: any; payload: any }>(
  'GoalsTargetsList',
  async ({ url, payload }, thunkAPI) => {
     return await Axios.post(`/Sports${url}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const GoalsTargetsListSlice = createSlice({
  name: 'GoalsTargetsList',
  initialState,
  reducers: {
    clearListState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
      state.totalRecords = 0;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(listGoalsTargets.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(listGoalsTargets.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
      state.totalRecords = action?.payload?.totalRecords
    }).addCase(listGoalsTargets.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearListState } = GoalsTargetsListSlice.actions;
export default GoalsTargetsListSlice.reducer;