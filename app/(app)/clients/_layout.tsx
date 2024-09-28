import React from "react";
import {Stack} from "expo-router";

export default function ClientLayout() {
    return (
        <>
            <Stack screenOptions={{statusBarStyle: undefined}}>
                <Stack.Screen
                    name={"index"}
                    options={{
                        title: "Clientes"
                    }}
                />
                <Stack.Screen
                    name={'create-client'}
                    options={{
                        title: "Cadastro de cliente",
                    }}
                />
            </Stack>
        </>
    )
}