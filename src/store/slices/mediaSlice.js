import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  videos: [],
  categories: ['Music Videos', 'Live Performances', 'TV Shows', 'Variety'],
  selectedCategory: 'Music Videos',
  loading: false,
  error: null,
  searchQuery: ''
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setVideos: (state, action) => {
      state.videos = action.payload;
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
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
    }
  }
});

export const { 
  setVideos, 
  setLoading, 
  setError, 
  setSelectedCategory, 
  setSearchQuery, 
  clearSearch 
} = mediaSlice.actions;

export default mediaSlice.reducer;
