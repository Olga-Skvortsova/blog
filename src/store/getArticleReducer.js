import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  articles: [],
  numberOfArticles: 0,
  statusOfGetArticles: null,
  errorOfGetArticle: null,
};

export const getArticle = createAsyncThunk('articles/getArticle', async function ({ page, user }, { rejectWithValue }) {
  let nam;
  page === 0 ? (nam = 0) : (nam = page * 5 - 5);
  const head = {
    headers: {
      Authorization: `Token ${user.token}`,
    },
  };
  try {
    const responce = await fetch(
      `https://blog.kata.academy/api/articles?limit=5&offset=${nam}`,
      Object.keys(user).length > 0 ? head : null
    );
    if (!responce.ok) {
      throw new Error('server error');
    }
    const articles = await responce.json();
    return articles;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const getArticleReducer = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getArticle.pending, (state) => {
        state.statusOfGetArticles = 'loading';
        state.errorOfGetArticle = null;
      })
      .addCase(getArticle.fulfilled, (state, action) => {
        state.articles = action.payload.articles;
        state.numberOfArticles = action.payload.articlesCount;
        state.statusOfGetArticles = 'resolved';
        state.errorOfGetArticle = null;
      })
      .addCase(getArticle.rejected, (state, action) => {
        state.statusOfGetArticles = 'rejected';
        state.errorOfGetArticle = action.payload;
      });
  },
});

export default getArticleReducer.reducer;
