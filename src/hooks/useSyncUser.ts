import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

export const useSyncUser = () => {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    try {
      
      if (!isSignedIn) return;
      fetch('/api/user/sync', {
        method: 'POST',
      });
    } catch (error) {
      console.error('❌ Failed to sync user:', error);
    }
  }, [isSignedIn]);
};
