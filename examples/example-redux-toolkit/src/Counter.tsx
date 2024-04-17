import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState, counterSlice } from "./store";

export default function Counter() {
  const dispatch = useDispatch<AppDispatch>();

  const count = useSelector((state: RootState) => state.counter.count);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Count: {count}</Text>
      <Button
        title="Up"
        onPress={() => {
          dispatch(counterSlice.actions.up());
        }}
      />
      <Button
        title="Down"
        onPress={() => {
          dispatch(counterSlice.actions.down());
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
