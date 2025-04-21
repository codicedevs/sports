import { ThemeConfig } from "antd";

export const lightColors = {
  primary: "#000000",
  cleary: "#FEFEFE",
  secondary: "orange",
  pressed: "#fcfcfc",
  siderBack: "#f5f5f5",
};

export const darkColors = {
  primary: "#f0f0f0",      // gris claro (textos)
  cleary: "#2a2a2a",       // gris intermedio (header)
  secondary: "#888888",    // gris medio para acentos
  pressed: "#1f1f1f",       // gris más oscuro (presionado/fondo)
  siderBack: "#1a1a1a",     // fondo sidebar
};


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

export const darkTheme: ThemeConfig = {
  token: {
    colorBgBase: "#1a1a1a", 
    colorText: "#f0f0f0",   
    colorBgContainer: "#1a1a1a",

    
  },
  components: {
    Layout: {
      triggerBg: darkColors.primary,
      siderBg: darkColors.siderBack,
      colorTextBase: "#f0f0f0",
      headerBg: darkColors.cleary,
      headerPadding: "10px 0",
      headerHeight: "auto",
      bodyBg: "#1a1a1a",
      colorBgLayout: "#1a1a1a",
      
    },
    Menu: {
      subMenuItemBg: darkColors.siderBack,
      itemBg: darkColors.siderBack,
      itemSelectedBg: darkColors.cleary,
      itemSelectedColor: darkColors.primary,
      subMenuItemSelectedColor: darkColors.primary,
      itemHoverBg: darkColors.cleary,
    },
    Table: {
      headerBg: "#2a2a2a",
      headerColor: "#ffffff",
    },
    Input: {
      colorBgContainer: "#2a2a2a",
      colorText: "#f0f0f0",
      colorBorder: "#444444",
      activeBorderColor: darkColors.primary,
      colorTextPlaceholder: "#f0f0f0"
    },
    Select: {
      colorBgContainer: "#2a2a2a",
      colorText: "#f0f0f0",
      colorBorder: "#444444",
      selectorBg: "#2a2a2a",
      optionSelectedBg: darkColors.primary,
      optionSelectedColor: "#2a2a2a", 
    },
    Button: {
      colorText: "#ffffff",
      colorPrimary: "#444444",
      colorPrimaryHover: "#3f76d1",
      colorBgContainer: "#2a2a2a",
      colorBorder: "#555555",
      defaultBg: "#2a2a2a",
      defaultColor: "#ffffff",
      defaultBorderColor: "#555555",
      
    },
    Typography: {
      colorText: "#f0f0f0",
    },
    Segmented: { // mñn tarde noche
      itemColor:  "#a6a2a2",
      itemSelectedColor: "#f0f0f0", 
      colorBgContainer: "#2a2a2a", 
      colorPrimary: "#3f76d1", 
      colorBorder: "#ffffff", 
      
    }
  },
};

