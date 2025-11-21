import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Safety timeout to avoid infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Auth callback timed out — redirecting');
      navigate('/dashboard');
    }, 6000);

    const handleOAuthCallback = async () => {
      try {
        // This is CRITICAL: exchange ?code= for Supabase session
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );

        if (error) {
          console.error('OAuth callback error:', error.message);
          setError(error.message);
          navigate('/login');
          return;
        }

        console.log("OAuth Success:", data);
        navigate('/dashboard');

      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Unexpected error occurred.');
        navigate('/login');
      } finally {
        clearTimeout(timeoutId);
      }
    };

    handleOAuthCallback();

    return () => clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Completing sign-in...</p>
        </>
      )}
    </div>
  );
}
