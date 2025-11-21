import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('AuthCallback timeout → redirecting');
      navigate('/dashboard');
    }, 6000);

    const handleCallback = async () => {
      try {
        // 🔥 This is CRITICAL for Google OAuth:
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );

        if (error) {
          console.error("OAuth Error:", error.message);
          setError(error.message);
          navigate("/login");
          return;
        }

        console.log("OAuth Success:", data);
        navigate("/dashboard");

      } catch (err) {
        console.error("Unexpected OAuth error:", err);
        setError("Unexpected error occurred");
        navigate("/login");
      } finally {
        clearTimeout(timeoutId);
      }
    };

    handleCallback();
    return () => clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {error ? (
        <div className="text-red-600 mb-4">{error}</div>
      ) : (
        <>
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Completing authentication...</p>
        </>
      )}
    </div>
  );
}
