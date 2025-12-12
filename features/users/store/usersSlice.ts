import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createUser,
  deleteUser,
  fetchUserById,
  fetchUsers,
  updateUser,
} from '@/features/users/services/usersApi';
import { NewUserPayload, User } from '@/features/users/types/user';

export type UsersState = {
  list: User[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deletingIds: number[];
  error?: string;
};

const initialState: UsersState = {
  list: [],
  loading: false,
  creating: false,
  updating: false,
  deletingIds: [],
  error: undefined,
};

export const fetchUsersThunk = createAsyncThunk('users/fetch', async () => {
  const users = await fetchUsers();
  return users;
});

export const fetchUserByIdThunk = createAsyncThunk(
  'users/fetchById',
  async (id: number) => {
    const user = await fetchUserById(id);
    return user;
  },
);

export const createUserThunk = createAsyncThunk(
  'users/create',
  async (payload: NewUserPayload) => {
    const created = await createUser(payload);
    return created;
  },
);

export const updateUserThunk = createAsyncThunk(
  'users/update',
  async ({ id, payload }: { id: number; payload: NewUserPayload }) => {
    const updated = await updateUser(id, payload);
    return updated;
  },
);

export const deleteUserThunk = createAsyncThunk(
  'users/delete',
  async (id: number) => {
    await deleteUser(id);
    return id;
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.list = action.payload;
    },
    upsertUser(state, action: PayloadAction<User>) {
      const index = state.list.findIndex((u) => u.id === action.payload.id);
      if (index >= 0) {
        state.list[index] = action.payload;
      } else {
        state.list.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Kullanıcılar getirilirken bir hata oluştu.';
      })
      .addCase(fetchUserByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchUserByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(
          (user) => user.id === action.payload.id,
        );
        if (index >= 0) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(fetchUserByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Kullanıcı detayı getirilirken hata oluştu.';
      })
      .addCase(createUserThunk.pending, (state) => {
        state.creating = true;
        state.error = undefined;
      })
      .addCase(createUserThunk.fulfilled, (state, action) => {
        state.creating = false;
        state.list = [action.payload, ...state.list];
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.creating = false;
        state.error =
          action.error.message || 'Kullanıcı oluşturulurken bir hata oluştu.';
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.updating = true;
        state.error = undefined;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.list.findIndex(
          (user) => user.id === action.payload.id,
        );
        if (index >= 0) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.updating = false;
        state.error =
          action.error.message || 'Kullanıcı güncellenirken bir hata oluştu.';
      })
      .addCase(deleteUserThunk.pending, (state, action) => {
        state.deletingIds.push(action.meta.arg);
        state.error = undefined;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.deletingIds = state.deletingIds.filter(
          (id) => id !== action.payload,
        );
        state.list = state.list.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.deletingIds = state.deletingIds.filter(
          (id) => id !== action.meta.arg,
        );
        state.error =
          action.error.message || 'Kullanıcı silinirken bir hata oluştu.';
      });
  },
});

export const { setUsers, upsertUser } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;

