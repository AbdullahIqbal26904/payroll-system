import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { holidaysAPI } from '@/lib/api';

// Async thunks for holidays
export const fetchHolidaySettings = createAsyncThunk(
  'holidays/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await holidaysAPI.getHolidaySettings();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch holiday settings'
      );
    }
  }
);

export const updateHolidaySettings = createAsyncThunk(
  'holidays/updateSettings',
  async (settingsData, { rejectWithValue }) => {
    try {
      const response = await holidaysAPI.updateHolidaySettings(settingsData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update holiday settings'
      );
    }
  }
);

export const fetchHolidays = createAsyncThunk(
  'holidays/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await holidaysAPI.getHolidays(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch holidays'
      );
    }
  }
);

export const fetchHolidayById = createAsyncThunk(
  'holidays/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await holidaysAPI.getHoliday(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch holiday details'
      );
    }
  }
);

export const fetchHolidaysInRange = createAsyncThunk(
  'holidays/fetchInRange',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await holidaysAPI.getHolidaysInRange(startDate, endDate);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch holidays in range'
      );
    }
  }
);

export const createHoliday = createAsyncThunk(
  'holidays/create',
  async (holidayData, { rejectWithValue }) => {
    try {
      const response = await holidaysAPI.createHoliday(holidayData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create holiday'
      );
    }
  }
);

export const updateHoliday = createAsyncThunk(
  'holidays/update',
  async ({ id, holidayData }, { rejectWithValue }) => {
    try {
      const response = await holidaysAPI.updateHoliday(id, holidayData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update holiday'
      );
    }
  }
);

export const deleteHoliday = createAsyncThunk(
  'holidays/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await holidaysAPI.deleteHoliday(id);
      return { id, response: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete holiday'
      );
    }
  }
);

// Initial state
const initialState = {
  settings: {
    paid_holidays_enabled: false
  },
  holidays: [],
  holiday: null,
  holidaysInRange: [],
  loading: false,
  error: null,
  success: false
};

// Holiday slice
const holidaySlice = createSlice({
  name: 'holidays',
  initialState,
  reducers: {
    resetHolidayState: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch holiday settings
      .addCase(fetchHolidaySettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidaySettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload.data;
      })
      .addCase(fetchHolidaySettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update holiday settings
      .addCase(updateHolidaySettings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateHolidaySettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload.data;
        state.success = true;
      })
      .addCase(updateHolidaySettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Fetch all holidays
      .addCase(fetchHolidays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays = action.payload.data;
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch holiday by id
      .addCase(fetchHolidayById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidayById.fulfilled, (state, action) => {
        state.loading = false;
        state.holiday = action.payload.data;
      })
      .addCase(fetchHolidayById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch holidays in range
      .addCase(fetchHolidaysInRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidaysInRange.fulfilled, (state, action) => {
        state.loading = false;
        state.holidaysInRange = action.payload.data;
      })
      .addCase(fetchHolidaysInRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create holiday
      .addCase(createHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays.push(action.payload.data);
        state.success = true;
      })
      .addCase(createHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Update holiday
      .addCase(updateHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays = state.holidays.map(holiday => 
          holiday.id === action.payload.data.id ? action.payload.data : holiday
        );
        state.holiday = action.payload.data;
        state.success = true;
      })
      .addCase(updateHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Delete holiday
      .addCase(deleteHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays = state.holidays.filter(holiday => holiday.id !== action.payload.id);
        state.success = true;
      })
      .addCase(deleteHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  }
});

export const { resetHolidayState } = holidaySlice.actions;

export default holidaySlice.reducer;
