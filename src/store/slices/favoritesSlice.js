import { createSlice } from '@reduxjs/toolkit';
import FavoritesService from '../../services/favoritesService';
import GamificationService, { XP_REWARDS } from '../../services/gamificationService';

const initialState = {
  groups: [],
  idols: [],
  videos: [],
  concerts: [],
  loading: false
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleGroupFavorite: (state, action) => {
      const index = state.groups.findIndex(g => g.id === action.payload.id);
      if (index >= 0) {
        state.groups.splice(index, 1);
      } else {
        state.groups.push(action.payload);
      }
    },
    toggleIdolFavorite: (state, action) => {
      const index = state.idols.findIndex(i => i.id === action.payload.id);
      if (index >= 0) {
        state.idols.splice(index, 1);
      } else {
        state.idols.push(action.payload);
      }
    },
    toggleVideoFavorite: (state, action) => {
      const index = state.videos.findIndex(v => v.id === action.payload.id || v.videoId === action.payload.videoId);
      if (index >= 0) {
        state.videos.splice(index, 1);
      } else {
        state.videos.push(action.payload);
      }
    },
    toggleConcertFavorite: (state, action) => {
      const index = state.concerts.findIndex(c => c.id === action.payload.id);
      if (index >= 0) {
        state.concerts.splice(index, 1);
      } else {
        state.concerts.push(action.payload);
      }
    },
    setFavorites: (state, action) => {
      const payload = action.payload || {};
      return {
        ...state,
        groups: payload.groups || [],
        idols: payload.idols || [],
        videos: payload.videos || [],
        concerts: payload.concerts || []
      };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearFavorites: (state) => {
      return initialState;
    }
  }
});

export const { 
  toggleGroupFavorite, 
  toggleIdolFavorite, 
  toggleVideoFavorite, 
  toggleConcertFavorite, 
  setFavorites, 
  setLoading,
  clearFavorites 
} = favoritesSlice.actions;

// Thunk-like helpers (call from components with dispatch + uid)
// These keep Redux in sync + persist + award XP
export const toggleGroupFavoriteAsync = (uid, group) => async (dispatch, getState) => {
  if (!uid) {
    dispatch(toggleGroupFavorite(group));
    return;
  }
  dispatch(setLoading(true));
  const result = await FavoritesService.toggleFavorite(uid, 'groups', group);
  if (result.success) {
    dispatch(setFavorites(result.data));
    // Award XP only when newly added
    if (result.added) {
      await GamificationService.awardActionXP(uid, 'ADD_FAVORITE');
    }
  } else {
    // Fallback to local toggle
    dispatch(toggleGroupFavorite(group));
  }
  dispatch(setLoading(false));
};

export const toggleVideoFavoriteAsync = (uid, video) => async (dispatch) => {
  if (!uid) {
    dispatch(toggleVideoFavorite(video));
    return;
  }
  dispatch(setLoading(true));
  const result = await FavoritesService.toggleFavorite(uid, 'videos', video);
  if (result.success) {
    dispatch(setFavorites(result.data));
    if (result.added) await GamificationService.awardActionXP(uid, 'ADD_FAVORITE');
  } else {
    dispatch(toggleVideoFavorite(video));
  }
  dispatch(setLoading(false));
};

export const toggleConcertFavoriteAsync = (uid, concert) => async (dispatch) => {
  if (!uid) {
    dispatch(toggleConcertFavorite(concert));
    return;
  }
  dispatch(setLoading(true));
  const result = await FavoritesService.toggleFavorite(uid, 'concerts', concert);
  if (result.success) {
    dispatch(setFavorites(result.data));
    if (result.added) await GamificationService.awardActionXP(uid, 'ADD_FAVORITE');
  } else {
    dispatch(toggleConcertFavorite(concert));
  }
  dispatch(setLoading(false));
};

export const loadFavorites = (uid) => async (dispatch) => {
  if (!uid) return;
  dispatch(setLoading(true));
  const res = await FavoritesService.getUserFavorites(uid);
  if (res.success) {
    dispatch(setFavorites(res.data));
  }
  dispatch(setLoading(false));
};

export default favoritesSlice.reducer;
