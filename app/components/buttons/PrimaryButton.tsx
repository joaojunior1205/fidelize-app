import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React from "react";

interface IProps {
    onPress: any,
    loading: boolean,
    text: string,
    iconName: any
}

const PrimaryButton = (props: IProps) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={props.onPress}
            disabled={props.loading}
        >
            {props.loading ? (
                <ActivityIndicator color="#ffffff"/>
            ) : (
                <View style={styles.containerLabelButton}>
                    <Text style={styles.title}>{props.text}</Text>
                    <Ionicons name={props.iconName} size={24} color="#ffffff"/>
                </View>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },

    containerLabelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
})

export default PrimaryButton;