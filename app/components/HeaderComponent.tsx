import React from "react";
import {StyleSheet, TouchableOpacity, View, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";

interface IProps {
    title?: string;
}

const HeaderComponent = ({title = ""}: IProps) => {
    const goBack = () => {
        router.back();
    }

    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF"/>
                </TouchableOpacity>
            </View>

            <View>
                <Text style={styles.title}>{title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 30,
        marginHorizontal: 15,
        marginVertical: 10,
    },

    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },

    backButton: {}
});

export default HeaderComponent;