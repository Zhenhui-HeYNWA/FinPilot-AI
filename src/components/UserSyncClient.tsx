'use client';
import { useSyncUser } from '@/hooks/useSyncUser';

const UserSyncClient = () => {
  useSyncUser();
  return null;
};

export default UserSyncClient;
