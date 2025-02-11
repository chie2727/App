import React, {Component, ForwardedRef} from 'react';
// eslint-disable-next-line no-restricted-imports
import {TextInput, TextInputProps} from 'react-native';
import Animated, {AnimatedProps} from 'react-native-reanimated';
import useTheme from '@hooks/useTheme';

type AnimatedTextInputRef = Component<AnimatedProps<TextInputProps>>;
// Convert the underlying TextInput into an Animated component so that we can take an animated ref and pass it to a worklet
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function RNTextInputWithRef(props: TextInputProps, ref: ForwardedRef<React.Component<AnimatedProps<TextInputProps>>>) {
    const theme = useTheme();

    return (
        <AnimatedTextInput
            allowFontScaling={false}
            textBreakStrategy="simple"
            keyboardAppearance={theme.colorScheme}
            ref={(refHandle) => {
                if (typeof ref !== 'function') {
                    return;
                }
                ref(refHandle);
            }}
            // eslint-disable-next-line
            {...props}
        />
    );
}

RNTextInputWithRef.displayName = 'RNTextInputWithRef';

export default React.forwardRef(RNTextInputWithRef);

export type {AnimatedTextInputRef};
