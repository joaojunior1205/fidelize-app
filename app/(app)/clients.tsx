import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
} from 'react-native';
import ClientApi from "@/api/auth/client-api";
import colors from "../colors";

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
        <View style={styles.container}>
            <FlatList
                data={client}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                        <Text style={styles.clientName}>
                            {item.name || '-'}
                        </Text>

                        <Text style={styles.phoneNumber}>
                            {item?.phone || '-'}
                        </Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    cardContainer: {
        borderBottomWidth: 1,
        borderColor: colors.lineBorderColor,
        padding: 7,
        gap: 4
    },

    clientName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textColor
    },

    phoneNumber: {
        fontSize: 12,
        fontWeight: '400',
        color: colors.textColor,
    }
})