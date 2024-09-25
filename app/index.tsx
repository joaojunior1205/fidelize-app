import {Redirect} from 'expo-router';
import {useAuth} from './AuthContext';

export default function Index() {
    const {isAuthenticated, userInfo} = useAuth();

    if (isAuthenticated && userInfo) {
        return <Redirect href={'/(app)/home'}/>;
    }

    return <Redirect href="/choose-login-type"/>;
}