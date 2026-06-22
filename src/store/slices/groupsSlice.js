import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  groups: [],
  selectedGroup: null,
  loading: false,
  error: null,
  searchQuery: '',
  filters: {
    agency: null,
    debutYear: null
  }
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups: (state, action) => {
      state.groups = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedGroup: (state, action) => {
      state.selectedGroup = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = '';
    }
  }
});

export const { 
  setGroups, 
  setSelectedGroup, 
  setLoading, 
  setError, 
  setSearchQuery, 
  setFilters, 
  clearFilters 
} = groupsSlice.actions;

export default groupsSlice.reducer;
