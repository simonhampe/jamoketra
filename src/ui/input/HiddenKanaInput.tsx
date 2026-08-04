import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { TextInput, StyleSheet } from "react-native";

export interface HiddenKanaInputHandle {
  focus: () => void;
  /** Ends composition and wipes the buffer -- only ever call this between sessions. */
  blurAndClear: () => void;
}

interface Props {
  onChangeText: (raw: string) => void;
}

/**
 * The only real TextInput in the app. Fully transparent, sits over the
 * play screen so tapping anywhere reopens the keyboard. Uncontrolled on
 * purpose (no `value` prop) -- setting `value` from state on every
 * keystroke is exactly the kind of re-render that desyncs an active IME
 * composition. The buffer is left to grow for the whole session; it is
 * only ever cleared via blurAndClear(), and only between sessions.
 */
export const HiddenKanaInput = forwardRef<HiddenKanaInputHandle, Props>(
  ({ onChangeText }, ref) => {
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blurAndClear: () => {
        inputRef.current?.blur();
        inputRef.current?.clear();
        inputRef.current?.focus();
      },
    }));

    return (
      <TextInput
        ref={inputRef}
        style={styles.hidden}
        autoFocus
        autoCorrect={false}
        autoCapitalize="none"
        spellCheck={false}
        keyboardType="default"
        onChangeText={onChangeText}
        caretHidden
        blurOnSubmit={false}
      />
    );
  }
);
HiddenKanaInput.displayName = "HiddenKanaInput";

const styles = StyleSheet.create({
  hidden: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
});
