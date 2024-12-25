import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface StaffEditState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: StaffEditState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const editStaff = createAsyncThunk<any, {payload: any }>(
  'StaffEdit',
  async (payload , thunkAPI) => {
     return await Axios.post(`/Sports/GetStaffByID`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const StaffEditSlice = createSlice({
  name: 'StaffEdit',
  initialState,
  reducers: {
    clearEditState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(editStaff.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(editStaff.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(editStaff.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearEditState } = StaffEditSlice.actions;
export default StaffEditSlice.reducer;