import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const TopProgressBar = () => {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const handleStart = (url: string) => {
      if (url !== router.asPath) {
        setProgress(30);
        setVisible(true);
      }
    };
    
    const handleComplete = () => {
      setProgress(100);
      timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setProgress(0), 300); // reset after fade out
      }, 400);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
      clearTimeout(timer);
    };
  }, [router]);

  if (!visible && progress === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        background: '#1E5FA6', // primary-light
        zIndex: 99999,
        transition: `width 0.4s ease, opacity 0.3s ease`,
        width: `${progress}%`,
        opacity: visible ? 1 : 0,
        boxShadow: '0 0 10px rgba(30,95,166,0.5)',
      }}
    />
  );
};
