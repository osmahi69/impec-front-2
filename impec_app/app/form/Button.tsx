import React, { Children } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ButtonProps {
  children: string;
  type?: "primary" | "secondary";
  onPress: () => void;
}

export const Button: React.FunctionComponent<ButtonProps> = ({
  type = "primary",
  children,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
       /*  style={tailwind(
          `px-4 py-4 mt-2 rounded-md ${
            type === "primary" ? "bg-primary" : "bg-white border border-primary"
          }`
        )} */
      >
        <Text
          /* style={[
            tailwind("text-center uppercase"),
            tailwind(type === "primary" ? "text-white" : "text-primary"),
          ]} */
        >
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};