import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet, ScrollView,
    TouchableOpacity,
} from 'react-native';
import ClientApi from "@/api/auth/client-api";
import colors from "../../colors";
import LowerFloatingButton from "@/app/components/buttons/LowerFloatingButton";
import {router, useFocusEffect} from "expo-router";
import { IClient } from '@/app/@types/client-type';

export default function ClientsScreen() {
    const [loading, setLoading] = React.useState(true);
    const [client, setClient] = React.useState<IClient[] | null>(null);

    React.useEffect(() => {
        getClient();
    }, []);

    const getClient = () => {
        setLoading(true);

        const client = new ClientApi();

        client
            .get()
            .then(setClient)
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }

    const navigationToClientDetail = (client: IClient | null) => {
        if (client === null) return;

        router.push({
            pathname: "/(app)/clients/client-detail",
            params: {
                client: JSON.stringify(client)
            }
        });
    }

    useFocusEffect(
        React.useCallback(() => {
            getClient();
        }, [])
    );


    if (loading) {
        return (
            <View>
                <Text>Carregando...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={client}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View>
                        <Text>Empty State</Text>
                    </View>
                )}
                renderItem={({item}) => (
                    <TouchableOpacity 
                        onPress={() => navigationToClientDetail(item)}
                        style={styles.cardContainer}>
                        <Text style={styles.clientName}>
                            {item.name || '-'}
                        </Text>

                        <Text style={styles.phoneNumber}>
                            {item?.phone || '-'}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            <LowerFloatingButton
                onPress={() => {
                    router.push({
                        pathname: "/clients/create-client",
                        params: {}
                    });
                }}/>
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