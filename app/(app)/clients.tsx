import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import ClientApi from "@/api/auth/client-api";

export default function ClientsScreen() {
    const [loading, setLoading] = React.useState(true);
    const [client, setClient] = React.useState(null);

    React.useEffect(() => {
        const client = new ClientApi();

        client
            .get()
            .then(setClient)
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, []);

    if (loading) {
        console.log('carregando...')
    }

    return (
        <View>
            <Text>{JSON.stringify(client)}</Text>
        </View>
    )
}