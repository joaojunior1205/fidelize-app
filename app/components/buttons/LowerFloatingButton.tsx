import {Animated, Easing, StyleSheet, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import colors from "@/app/colors";

interface IProps {
    options?: Array<{icon: any, onPress: any}>,
    onPress?: any
}

const LowerFloatingButton = ({options = [], onPress}: IProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const animationValue = React.useRef(new Animated.Value(0)).current;

    const toggleOptions = () => {
        const toValue = isOpen ? 0 : 1;
        setIsOpen(!isOpen);

        Animated.timing(animationValue, {
            toValue,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            {!!options?.length && options.map((option, index) => {
                const translateY = animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, -(index + 1) * 60],
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.optionButton,
                            { transform: [{ translateY }], opacity: animationValue },
                        ]}
                    >
                        <TouchableOpacity style={styles.optionStyles} onPress={option?.onPress}>
                            <Ionicons name={option.icon} size={24} color={colors.white} />
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}

            <TouchableOpacity style={styles.buttonContainer} onPress={options?.length ? toggleOptions : onPress}>
                <Ionicons name={isOpen ? "close" : "add"} size={32} color={colors.white}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 20,
        right: 20,
    },

    optionStyles: {
        backgroundColor: colors.secondButtonPrimary,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },

    buttonContainer: {
        height: 48,
        width: 48,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.buttonPrimary,
    },

    optionButton: {
        position: "absolute",
        height: 48,
        width: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 24,
    },
})

export default LowerFloatingButton;