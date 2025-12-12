import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createUser,
  deleteUser,
  fetchUserById,
  fetchUsers,
  updateUser,
} from '@/features/users/services/usersApi';
import { NewUserPayload, User } from '@/features/users/types/user';
import { RootState } from '@/lib/store';
import {
  readAvatarMap,
  removeAvatar,
  setAvatar,
  AvatarMap,
} from '@/lib/storage/avatarStorage';
import {
  readLocalUsers,
  removeLocalUser,
  writeLocalUsers,
  upsertLocalUser,
} from '@/lib/storage/userStorage';

const nextLocalId = (users: User[]) => {
  const maxId = users.reduce((max, user) => Math.max(max, user.id || 0), 0);
  return maxId + 1;
};

type FetchUsersPayload = {
  users: User[];
  fromCache?: boolean;
};

type FetchUserByIdPayload = {
  user: User;
  fromCache?: boolean;
};

export type UsersState = {
  list: User[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deletingIds: number[];
  avatarMap: AvatarMap;
  error?: string;
};

const initialState: UsersState = {
  list: [],
  loading: false,
  creating: false,
  updating: false,
  deletingIds: [],
  avatarMap: {},
  error: undefined,
};

export const fetchUsersThunk = createAsyncThunk<
  FetchUsersPayload,
  void,
  { rejectValue: { message: string } }
>('users/fetch', async (_, { rejectWithValue }) => {
  try {
    const users = await fetchUsers();
    return { users, fromCache: false };
  } catch (err: any) {
    const cached = readLocalUsers();
    if (cached.length) {
      return { users: cached, fromCache: true };
    }
    return rejectWithValue({
      message: err?.message || 'Kullanıcılar getirilirken bir hata oluştu.',
    });
  }
});

export const fetchUserByIdThunk = createAsyncThunk(
  'users/fetchById',
  async (id: number) => {
    const local = readLocalUsers().find((user) => user.id === id);
    if (local)
      return { user: local, fromCache: true } satisfies FetchUserByIdPayload;
    const user = await fetchUserById(id);
    return { user, fromCache: false } satisfies FetchUserByIdPayload;
  },
);

export const createUserThunk = createAsyncThunk<
  User,
  NewUserPayload,
  { state: RootState }
>('users/create', async (payload, { getState }) => {
  try {
    const created = await createUser(payload);
    return created;
  } catch {
    const state = getState().users;
    const fallbackId = nextLocalId(state.list);
    return { ...payload, id: fallbackId };
  }
});

export const updateUserThunk = createAsyncThunk(
  'users/update',
  async ({ id, payload }: { id: number; payload: NewUserPayload }) => {
    try {
      const updated = await updateUser(id, payload);
      return updated;
    } catch {
      return { ...payload, id };
    }
  },
);

export const deleteUserThunk = createAsyncThunk(
  'users/delete',
  async (id: number) => {
    try {
      await deleteUser(id);
    } catch {
      // ignore, simulate success
    }
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
        const map = readAvatarMap();
        state.avatarMap = map;
        const localUsers = readLocalUsers();
        const localById = new Map(localUsers.map((user) => [user.id, user]));
        const sourceUsers = action.payload.users;
        const merged = [
          ...localUsers,
          ...sourceUsers.filter((user) => !localById.has(user.id)),
        ];
        state.list = merged.map((user) => ({
          ...user,
          avatarUrl: map[user.id] ?? user.avatarUrl,
        }));
        writeLocalUsers(state.list);
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          action.error.message ||
          'Kullanıcılar getirilirken bir hata oluştu.';
      })
      .addCase(fetchUserByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchUserByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        const avatarUrl = state.avatarMap[action.payload.user.id];
        const index = state.list.findIndex(
          (user) => user.id === action.payload.user.id,
        );
        const userWithAvatar = {
          ...action.payload.user,
          avatarUrl: avatarUrl ?? action.payload.user.avatarUrl,
        };
        if (index >= 0) {
          state.list[index] = userWithAvatar;
        } else {
          state.list.push(userWithAvatar);
        }
        writeLocalUsers(state.list);
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
        const existingIds = new Set(state.list.map((u) => u.id));
        const userId = existingIds.has(action.payload.id)
          ? nextLocalId(state.list)
          : action.payload.id;
        const normalizedUser = { ...action.payload, id: userId };
        if (normalizedUser.avatarUrl) {
          state.avatarMap = setAvatar(normalizedUser.id, normalizedUser.avatarUrl);
        }
        const userWithAvatar = {
          ...normalizedUser,
          avatarUrl:
            state.avatarMap[normalizedUser.id] ?? normalizedUser.avatarUrl,
        };
        const existingIndex = state.list.findIndex(
          (user) => user.id === userWithAvatar.id,
        );
        if (existingIndex >= 0) {
          state.list[existingIndex] = userWithAvatar;
        } else {
          state.list = [userWithAvatar, ...state.list];
        }
        writeLocalUsers(upsertLocalUser(userWithAvatar));
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
        if (action.payload.avatarUrl) {
          state.avatarMap = setAvatar(action.payload.id, action.payload.avatarUrl);
        }
        const userWithAvatar = {
          ...action.payload,
          avatarUrl: state.avatarMap[action.payload.id] ?? action.payload.avatarUrl,
        };
        const index = state.list.findIndex(
          (user) => user.id === userWithAvatar.id,
        );
        if (index >= 0) {
          state.list[index] = userWithAvatar;
        } else {
          state.list.push(userWithAvatar);
        }
        writeLocalUsers(upsertLocalUser(userWithAvatar));
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
        state.avatarMap = removeAvatar(action.payload);
        state.list = state.list.filter((user) => user.id !== action.payload);
        removeLocalUser(action.payload);
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

