import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  concerts: [],
  loading: false,
  error: null,
  userLocation: null,
  filters: {
    country: null,
    city: null,
    artist: null
  }
};

const concertsSlice = createSlice({
  name: 'concerts',
  initialState,
  reducers: {
    setConcerts: (state, action) => {
      state.concerts = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const { 
  setConcerts, 
  setLoading, 
  setError, 
  setUserLocation, 
  setFilters, 
  clearFilters 
} = concertsSlice.actions;

export default concertsSlice.reducer;
