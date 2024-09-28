import React from "react";
import {StyleSheet, View} from "react-native";
import TextInputComponent from "@/app/components/input/TextInputComponent";
import PhoneInputComponent from "@/app/components/input/PhoneInputComponent";
import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import ClientApi from "@/api/auth/client-api";
import {router, useRouter} from "expo-router";

const createClient = (props: any) => {
    console.log(props)
    const [loading, setLoading] = React.useState(false);
    const [clientFormData, setClientFormData] = React.useState({
        name: null,
        email: null,
        phone: null,
    })

    const setValue = (key: string, value: string) => {
        if (!key) return null;

        setClientFormData(client => ({
            ...client,
            [key]: value,
        }));
    }

    const addClient = async () => {
        if (!clientFormData.name) {
            return alert("Preencha o nome");
        }

        if (!clientFormData.phone) {
            return alert("Preencha o telefone");
        }

        setLoading(true);
        const clientApi = new ClientApi();
        await clientApi.create(clientFormData);
        alert("Cliente adicionado com sucesso!");
        router.dismissAll()
    }

    return (
        <View style={styles.container}>
            <TextInputComponent
                value={clientFormData.name || ''}
                placeholder={"Nome do cliente"}
                setValue={(text: string) => setValue('name', text)}
                iconName={'people'}
            />

            <PhoneInputComponent
                value={clientFormData.phone || ''}
                placeholder={"Telefone"}
                setValue={(text: string) => setValue('phone', text)}
                iconName={'call'}
            />

            <TextInputComponent
                value={clientFormData.email || ''}
                placeholder={"E-mail"}
                setValue={(text: string) => setValue('email', text)}
                iconName={'mail'}
            />

            <PrimaryButton
                onPress={addClient}
                loading={loading}
                text={"Adicionar novo cliente"}
                iconName={"arrow-forward"}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 7,
        marginVertical: 20,
    }
})

export default createClient;