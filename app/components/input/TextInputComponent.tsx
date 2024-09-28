import {StyleSheet, TextInput, View} from "react-native";
import React from "react";
import colors from "@/app/colors";
import InputBase from "@/app/components/input/InputBase";

interface IProps {
    value: string;
    placeholder: string;
    setValue: any;
    iconName: any;
}

const TextInputComponent = (props: IProps) => {
    return (
        <InputBase
            iconName={props.iconName}
            slotBody={(
                <TextInput
                    style={styles.input}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChangeText={props.setValue}
                    placeholderTextColor={colors.placeholderColor}
                />
            )}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        fontSize: 16,
    },

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

export default TextInputComponent;