import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  news: [],
  loading: false,
  error: null,
  filters: {
    group: null,
    agency: null,
    dateRange: null
  }
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setNews: (state, action) => {
      state.news = action.payload;
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
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const { setNews, setLoading, setError, setFilters, clearFilters } = newsSlice.actions;
export default newsSlice.reducer;
