import { Redirect } from 'expo-router';
import { useAuth } from './AuthContext';

export default function Index() {
  const { isAuthenticated, userInfo } = useAuth();

  if (isAuthenticated && userInfo) {
    return <Redirect href={`/(app)/${userInfo.type === 'client' ? 'client' : 'company'}`} />;
  }

  return <Redirect href="/choose-login-type" />;
}