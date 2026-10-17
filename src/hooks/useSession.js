import { useEffect, useState } from 'react';
import { getSession } from '../api/client';

// The signed-in user's saved details (role, user ID, name); null until loaded.
export default function useSession() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    let active = true;
    getSession()
      .then(value => active && setSession(value))
      .catch(() => active && setSession({}));
    return () => {
      active = false;
    };
  }, []);
  return session;
}
