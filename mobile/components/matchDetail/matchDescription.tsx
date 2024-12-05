import { Div, Icon, Text } from "react-native-magnus";
import { customTheme } from "../../utils/theme";
import Match from "../../types/match.type";
import dayjs from "dayjs";
import { iconFontFamilyType } from "react-native-magnus/lib/typescript/src/ui/icon/icon.type";

interface MatchDetailsProps {
  match: Match;
}

interface ItemDetail {
  label: string;
  value: string;
  icon: string;
  iconFamily: iconFontFamilyType | undefined;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ match }) => {
  const formattedDate = dayjs(match.date).format("DD MMMM YYYY");
  const formattedTime = dayjs(match.date).format("HH:mm");

  const detailsItems: ItemDetail[] = [
    {
      label: "Fecha",
      value: formattedDate,
      icon: "calendar",
      iconFamily: "Feather",
    },
    {
      label: "Dirección",
      value: match.location.address,
      icon: "location",
      iconFamily: "Entypo",
    },
    {
      label: "Cancha",
      value: match.location.name,
      icon: "soccer-field",
      iconFamily: "MaterialCommunityIcons",
    },
    {
      label: "Horario",
      value: `${formattedTime} hs`,
      icon: "clockcircleo",
      iconFamily: "AntDesign",
    },
    {
      label: "Jugadores Confirmados",
      value: `${match.users.length} / ${match.playersLimit}`,
      icon: "user-friends",
      iconFamily: "FontAwesome5",
    },
  ];

  return (
    <>
      {detailsItems.map((detail, index) => (
        <Div mb="lg" justifyContent="space-between" flexDir="row" key={index}>
          <Div flexDir="row">
            <Icon
              name={detail.icon}
              fontFamily={detail.iconFamily}
              fontSize="lg"
              color={customTheme.colors.tertiary}
              mr="lg"
            />
            <Text fontSize="lg" color={customTheme.colors.background}>
              {detail.label}
            </Text>
          </Div>
          <Text fontSize="lg" color={customTheme.colors.background}>
            {detail.value}
          </Text>
        </Div>
      ))}
    </>
  );
};

export default MatchDetails;
