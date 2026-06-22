import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import newsReducer from './slices/newsSlice';
import groupsReducer from './slices/groupsSlice';
import concertsReducer from './slices/concertsSlice';
import mediaReducer from './slices/mediaSlice';
import quizReducer from './slices/quizSlice';
import favoritesReducer from './slices/favoritesSlice';
import gamificationReducer from './slices/gamificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    news: newsReducer,
    groups: groupsReducer,
    concerts: concertsReducer,
    media: mediaReducer,
    quiz: quizReducer,
    favorites: favoritesReducer,
    gamification: gamificationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
