import MaskInput from "react-native-mask-input";
import React from "react";
import InputBase from "@/app/components/input/InputBase";
import {StyleSheet} from "react-native";

interface IProps {
    value: string;
    placeholder: string;
    setValue: any;
    iconName: any;
}

const PHONE_MASK = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

const PhoneInputComponent = (props: IProps) => {
    const [errors, setErrors] = React.useState({});

    const validatePhone = (value: string) => {
        const unmaskedValue = value.replace(/[^\d]/g, '');
        if (unmaskedValue.length !== 11) {
            setErrors(prev => ({ ...prev, phone: 'Telefone deve conter 11 dígitos' }));
        } else {
            setErrors(prev => ({ ...prev, phone: '' }));
        }
    };


    return (
        <InputBase
            iconName={props.iconName}
            slotBody={(
                <MaskInput
                    style={styles.input}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChangeText={(masked, unmasked) => {
                        props.setValue(masked)
                        validatePhone(masked);
                    }}
                    mask={PHONE_MASK}
                    keyboardType="numeric"
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
})

export default PhoneInputComponent;