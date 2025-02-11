import { ThemeConfig } from "antd";
import { lightColors } from "./colors";

export const lightTheme: ThemeConfig = {
  token: {},
  components: {
    Layout: {
      triggerBg: lightColors.primary,
      siderBg: lightColors.primary,
      colorTextBase: "#3434dd",
      headerBg: "#ffffff",
      headerPadding: "10px 0",
      headerHeight: "auto",
    },
    Menu: {
      subMenuItemBg: lightColors.cleary,
      itemBg: lightColors.primary,
      itemSelectedBg: lightColors.pressed,
      colorText: "#ffffff",
    },
  },
};
