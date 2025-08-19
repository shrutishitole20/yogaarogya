import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

const UserCounter: React.FC = () => {
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setLoading(true);
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          throw error;
        }
        
        setUserCount(count || 0);
      } catch (error) {
        console.error('Error fetching user count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
    
    // Set up a subscription for real-time updates
    const subscription = supabase
      .channel('profiles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchUserCount();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Users className="text-purple-300" size={20} />
      <span className="text-white font-medium">
        {loading ? 'Loading...' : `${userCount} Registered Users`}
      </span>
    </div>
  );
};

export default UserCounter;