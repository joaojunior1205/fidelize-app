import {StyleSheet, View} from "react-native";
import React from "react";
import {Ionicons} from "@expo/vector-icons";

interface IProps {
    iconName: any;
    slotBody: React.ReactElement
}

const InputBase = (props: IProps) => {
    return (
        <View style={styles.inputContainer}>
            {!!props.iconName && (
                <Ionicons name={props.iconName} size={24} color="#007AFF" style={styles.inputIcon}/>
            )}

            {props.slotBody}
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 50,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    inputIcon: {
        marginRight: 12,
    },
})

export default InputBase;