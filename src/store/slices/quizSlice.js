import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  quizzes: [],
  currentQuiz: null,
  score: 0,
  answers: [],
  badges: [],
  history: [],
  loading: false,
  error: null
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
      state.loading = false;
    },
    setCurrentQuiz: (state, action) => {
      state.currentQuiz = action.payload;
      state.score = 0;
      state.answers = [];
    },
    setAnswer: (state, action) => {
      state.answers.push(action.payload);
    },
    setScore: (state, action) => {
      state.score = action.payload;
    },
    addToHistory: (state, action) => {
      state.history.unshift(action.payload);
    },
    addBadge: (state, action) => {
      if (!state.badges.find(b => b.id === action.payload.id)) {
        state.badges.push(action.payload);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetQuiz: (state) => {
      state.currentQuiz = null;
      state.score = 0;
      state.answers = [];
    }
  }
});

export const { 
  setQuizzes, 
  setCurrentQuiz, 
  setAnswer, 
  setScore, 
  addToHistory, 
  addBadge, 
  setLoading, 
  setError, 
  resetQuiz 
} = quizSlice.actions;

export default quizSlice.reducer;
