'use client';

import { useState, useEffect } from 'react';

export function useContentTypesDebug() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔵 DEBUG HOOK - useEffect triggered');
    
    fetch('/api/content-types')
      .then(res => {
        console.log('🔵 DEBUG HOOK - Response received', res.status);
        return res.json();
      })
      .then(data => {
        console.log('🔵 DEBUG HOOK - Data parsed:', data);
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('🔵 DEBUG HOOK - Error:', err);
        setLoading(false);
      });
  }, []);

  console.log('🔵 DEBUG HOOK - Render, loading:', loading, 'data:', data);

  return { data, loading };
}
