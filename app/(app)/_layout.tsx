import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import {Tabs} from 'expo-router';
import {StatusBar} from "expo-status-bar";

export default function HomeLayout() {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: '#007AFF',
                    tabBarInactiveTintColor: '#333',
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        tabBarLabel: 'Meu dia',
                        title: 'Meu dia',
                        tabBarIcon: ({color, size}) => (
                            <Ionicons name="home" size={size} color={color}/>
                        ),
                    }}
                />

                <Tabs.Screen
                    name="clients"
                    options={{
                        tabBarLabel: 'Clientes',
                        headerShown: false,
                        title: 'Clientes',
                        tabBarIcon: ({color, size}) => (
                            <Ionicons name="person" size={size} color={color}/>
                        ),
                    }}
                />
            </Tabs>
        </>
    );
}