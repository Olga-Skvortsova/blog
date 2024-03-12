import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  statusOfLoginUser: null,
  errorOfLoginUser: null,
  statusOfEnterUser: null,
  errorOfEnterUser: null,
  statusOfUpdateUser: null,
  errorOfUpdateUser: null,
};

export const loginUser = createAsyncThunk('logUser/loginUser', async function (data, { rejectWithValue }) {
  try {
    const responce = await fetch('https://blog.kata.academy/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          username: data.username,
          email: data.email,
          password: data.password,
        },
      }),
    });
    if (!responce.ok) {
      const err = await responce.json();
      return rejectWithValue(err);
    }
    const user = await responce.json();
    return user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const enterUser = createAsyncThunk('logUser/enterUser', async function (data, { rejectWithValue }) {
  try {
    const responce = await fetch('https://blog.kata.academy/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          email: data.email,
          password: data.password,
        },
      }),
    });
    if (!responce.ok) {
      const err = await responce.json();
      return rejectWithValue(err);
    }
    const user = await responce.json();
    return user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateUser = createAsyncThunk('logUser/updateUser', async function ({ data, user }, { rejectWithValue }) {
  let infoForRequest = {};
  data.email ? (infoForRequest.email = data.email) : infoForRequest;
  data.username ? (infoForRequest.username = data.username) : infoForRequest;
  data.password ? (infoForRequest.password = data.password) : infoForRequest;
  data.avatar ? (infoForRequest.image = data.avatar) : infoForRequest;
  try {
    const responce = await fetch('https://blog.kata.academy/api/user', {
      method: 'PUT',
      headers: {
        Authorization: `Token ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: infoForRequest,
      }),
    });
    if (!responce.ok) {
      const err = await responce.json();
      return rejectWithValue(err);
    }
    const newUser = await responce.json();
    return newUser;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const loginUserReducer = createSlice({
  name: 'logUser',
  initialState,
  reducers: {
    logOutAction: (state) => {
      state.user = {};
    },
    clearErrorsAndStatus: (state) => {
      state.statusOfLoginUser = null;
      state.errorOfLoginUser = null;
      state.statusOfEnterUser = null;
      state.statusOfEnterUser = null;
      state.errorOfEnterUser = null;
      state.statusOfUpdateUser = null;
      state.errorOfUpdateUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.statusOfLoginUser = 'loading';
        state.errorOfLoginUser = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.statusOfLoginUser = 'resolved';
        state.errorOfLoginUser = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.statusOfLoginUser = 'rejected';
        state.errorOfLoginUser = action;
      })

      .addCase(enterUser.pending, (state) => {
        state.statusOfEnterUser = 'loading';
        state.errorOfEnterUser = null;
      })
      .addCase(enterUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.statusOfEnterUser = 'resolved';
        state.errorOfEnterUser = null;
      })
      .addCase(enterUser.rejected, (state, action) => {
        state.statusOfEnterUser = 'rejected';
        state.errorOfEnterUser = action;
      })

      .addCase(updateUser.pending, (state) => {
        state.statusOfUpdateUser = 'loading';
        state.errorOfUpdateUser = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.statusOfUpdateUser = 'resolved';
        state.errorOfUpdateUser = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.statusOfUpdateUser = 'rejected';
        state.errorOfUpdateUser = action;
      });
  },
});

export const { logOutAction, clearErrorsAndStatus } = loginUserReducer.actions;

export default loginUserReducer.reducer;
