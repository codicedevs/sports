import { ThemeConfig } from "antd";
import { lightColors } from "./colors";

export const lightTheme: ThemeConfig = {
  token: {},
  components: {
    Layout: {
      triggerBg: lightColors.primary,
      siderBg: lightColors.siderBack,
      colorTextBase: "#3434dd",
      headerBg: lightColors.cleary,
      headerPadding: "10px 0",
      headerHeight: "auto",
    },
    Menu: {
      subMenuItemBg: lightColors.siderBack,
      itemBg: lightColors.siderBack,
      itemSelectedBg: lightColors.cleary,
      itemSelectedColor: lightColors.primary,
      subMenuItemSelectedColor: lightColors.primary,
      itemHoverBg: lightColors.cleary,
      // itemColor: lightColors.primary,
    },
    Table: {
      headerBg: lightColors.primary,
      headerColor: "#ffffff",
    },
  },
};
