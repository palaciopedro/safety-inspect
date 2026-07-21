import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuthContext } from '../context/AuthContext';

function RootGuard() {
  const { session, loading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
  console.log("SESSION:", session);
  console.log("LOADING:", loading);
  console.log("SEGMENTS:", segments);

  if (loading) return;

  const inAuthGroup = segments[0] === '(auth)';

  if (!session && !inAuthGroup) {
    router.replace('/(auth)');
  } else if (session && inAuthGroup) {
    router.replace('/(app)');
  }
}, [session, loading, segments]); 

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootGuard />
    </AuthProvider>
  );
}