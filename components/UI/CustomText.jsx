import React from "react";
import { Text } from "react-native";
import myColors from "../../constants/myColors";
import useColorScheme from "../../hooks/useColorSchemeFix";

const CustomText = ({
  bold,
  size,
  color,
  complementaryStyle,
  otherProps,
  children,
}) => {
  const isDarkTheme = useColorScheme() === "dark";

  const fontSizeHandler = (sizeText) => {
    switch (sizeText) {
      case "H7":
        return 12;
      case "H6":
        return 14;
      case "H5":
        return 16;
      case "H4":
        return 18;
      case "H3":
        return 20;
      case "H2":
        return 28;
      case "H1":
        return 30;
      default:
        return 14;
    }
  };

  return (
    <Text
      style={{
        fontSize: fontSizeHandler(size),
        fontFamily: bold ? "Inter_700Bold" : "Inter_400Regular",
        color: color
          ? color
          : isDarkTheme
          ? myColors.gray_200
          : myColors.gray_900,
        ...complementaryStyle,
      }}
      {...otherProps}
    >
      {children}
    </Text>
  );
};

export default CustomText;
