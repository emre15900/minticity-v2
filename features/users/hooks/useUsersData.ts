'use client';

import { useCallback } from 'react';
import { App } from 'antd';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import {
  createUserThunk,
  deleteUserThunk,
  fetchUserByIdThunk,
  fetchUsersThunk,
  updateUserThunk,
} from '@/features/users/store/usersSlice';
import { NewUserPayload } from '@/features/users/types/user';

export function useUsersData() {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const state = useAppSelector((s) => s.users);

  const refresh = useCallback(() => {
    dispatch(fetchUsersThunk());
  }, [dispatch]);

  const createUser = useCallback(
    async (payload: NewUserPayload) => {
      const result = await dispatch(createUserThunk(payload));
      if (createUserThunk.fulfilled.match(result)) {
        message.success('Kullanıcı eklendi');
      }
      return result;
    },
    [dispatch, message],
  );

  const updateUser = useCallback(
    async (id: number, payload: NewUserPayload) => {
      const result = await dispatch(updateUserThunk({ id, payload }));
      if (updateUserThunk.fulfilled.match(result)) {
        message.success('Kullanıcı güncellendi');
      }
      return result;
    },
    [dispatch, message],
  );

  const removeUser = useCallback(
    async (id: number) => {
      const result = await dispatch(deleteUserThunk(id));
      if (deleteUserThunk.fulfilled.match(result)) {
        message.success('Kullanıcı silindi');
      }
      return result;
    },
    [dispatch, message],
  );

  const fetchUserById = useCallback(
    (id: number) => dispatch(fetchUserByIdThunk(id)),
    [dispatch],
  );

  return {
    ...state,
    refresh,
    createUser,
    updateUser,
    removeUser,
    fetchUserById,
  };
}

