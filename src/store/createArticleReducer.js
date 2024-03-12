import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  likedArticle: null,
  statusOfCreateArticle: null,
  errorOfCreateArticle: null,
  statusOfUpdateArticle: null,
  errorOfUpdateArticle: null,
  statusOfDeleteArticle: null,
  errorOfDeleteArticle: null,
  statusOfLikeArticle: null,
  errorOfLikeArticle: null,
};

export const createArticle = createAsyncThunk(
  'makeArticle/createArticle',
  async function ({ data, user }, { rejectWithValue }) {
    const newArticle = {};
    newArticle.title = data.title;
    newArticle.description = data.description;
    newArticle.body = data.text;
    const tagies = [];
    data.tags.forEach((tage) => {
      if (tage.tag) {
        tagies.push(tage.tag);
      }
    }, []);
    tagies.length > 0 ? (newArticle.tagList = tagies) : newArticle;
    try {
      const responce = await fetch('https://blog.kata.academy/api/articles', {
        method: 'POST',
        headers: {
          Authorization: `Token ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article: newArticle,
        }),
      });
      if (!responce.ok) {
        const err = await responce.json();
        return rejectWithValue(err);
      }
      const article = await responce.json();
      return article;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateArticle = createAsyncThunk(
  'makeArticle/updateArticle',
  async function ({ data, user, slug }, { rejectWithValue }) {
    const newArticle = {};
    newArticle.title = data.title;
    newArticle.description = data.description;
    newArticle.body = data.text;
    const tagies = [];
    data.tags.forEach((tage) => {
      if (tage.tag) {
        tagies.push(tage.tag);
      }
    }, []);
    tagies.length > 0 ? (newArticle.tagList = tagies) : newArticle;
    try {
      const responce = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
        method: 'PUT',
        headers: {
          Authorization: `Token ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article: newArticle,
        }),
      });
      if (!responce.ok) {
        const err = await responce.json();
        return rejectWithValue(err);
      }
      const article = await responce.json();
      return article;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteArticle = createAsyncThunk(
  'makeArticle/deleteArticle',
  async function ({ user, slug }, { rejectWithValue }) {
    try {
      const responce = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!responce.ok) {
        const err = await responce.json();
        return rejectWithValue(err);
      }
      return slug;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const likeArticle = createAsyncThunk(
  'makeArticle/likeArticle',
  async function ({ user, slug }, { rejectWithValue }) {
    try {
      const responce = await fetch(`https://blog.kata.academy/api/articles/${slug}/favorite`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!responce.ok) {
        const err = await responce.json();
        return rejectWithValue(err);
      }
      const article = await responce.json();
      return article;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const dislikeArticle = createAsyncThunk(
  'makeArticle/dislikeArticle',
  async function ({ user, slug }, { rejectWithValue }) {
    try {
      const responce = await fetch(`https://blog.kata.academy/api/articles/${slug}/favorite`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!responce.ok) {
        const err = await responce.json();
        return rejectWithValue(err);
      }
      const article = await responce.json();
      return article;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const createArticleReducer = createSlice({
  name: 'makeArticle',
  initialState,
  reducers: {
    clearErrorsAndStatusOfCreate: (state) => {
      state.likedArticle = null;
      state.statusOfCreateArticle = null;
      state.errorOfCreateArticle = null;
      state.statusOfUpdateArticle = null;
      state.errorOfUpdateArticle = null;
      state.statusOfDeleteArticle = null;
      state.errorOfDeleteArticle = null;
      state.statusOfLikeArticle = null;
      state.errorOfLikeArticle = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createArticle.pending, (state) => {
        state.statusOfCreateArticle = 'loading';
        state.errorOfCreateArticle = null;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.statusOfCreateArticle = 'resolved';
        state.errorOfCreateArticle = null;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.statusOfCreateArticle = 'rejected';
        state.errorOfCreateArticle = action;
      })

      .addCase(updateArticle.pending, (state) => {
        state.statusOfUpdateArticle = 'loading';
        state.errorOfUpdateArticle = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.statusOfUpdateArticle = 'resolved';
        state.errorOfUpdateArticle = null;
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.statusOfUpdateArticle = 'rejected';
        state.errorOfUpdateArticle = action;
      })

      .addCase(deleteArticle.pending, (state) => {
        state.statusOfDeleteArticle = 'loading';
        state.errorOfDeleteArticle = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.statusOfDeleteArticle = 'resolved';
        state.errorOfDeleteArticle = null;
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.statusOfDeleteArticle = 'rejected';
        state.errorOfDeleteArticle = action;
      })

      .addCase(likeArticle.pending, (state) => {
        state.statusOfLikeArticle = 'loading';
        state.errorOfLikeArticle = null;
      })
      .addCase(likeArticle.fulfilled, (state, action) => {
        state.likedArticle = action.payload;
        state.statusOfLikeArticle = 'resolved';
        state.errorOfLikeArticle = null;
      })
      .addCase(likeArticle.rejected, (state, action) => {
        state.statusOfLikeArticle = 'rejected';
        state.errorOfLikeArticle = action;
      })

      .addCase(dislikeArticle.pending, (state) => {
        state.statusOfLikeArticle = 'loading';
        state.errorOfLikeArticle = null;
      })
      .addCase(dislikeArticle.fulfilled, (state, action) => {
        state.likedArticle = action.payload;
        state.statusOfLikeArticle = 'resolved';
        state.errorOfLikeArticle = null;
      })
      .addCase(dislikeArticle.rejected, (state, action) => {
        state.statusOfLikeArticle = 'rejected';
        state.errorOfLikeArticle = action;
      });
  },
});

export const { clearErrorsAndStatusOfCreate } = createArticleReducer.actions;

export default createArticleReducer.reducer;
