import { IClient } from "@/app/@types/client-type";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

interface IParams {
    client?: string
}

const ClientDetail = (props: any) => {
    const params: IParams = useLocalSearchParams();
    const [client, setClient] = React.useState<IClient | null>();

    React.useEffect(() => {
        if (params && params.client) {
            const clientParsed: IClient = JSON.parse(params.client);
            setClient(clientParsed)
        }
    }, []);

    return (
        <View>
            <Text>
                {client?.name}
            </Text>

            <Text>
                {client?.email}
            </Text>

            <Text>
                {client?.phone}
            </Text>
        </View>
    )
}

export default ClientDetail;