import React, { useState } from "react";
import { FlatList, TouchableOpacity, Image } from "react-native";
import { Div, Text } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";
import { customTheme } from "../utils/theme";

const FriendsScreen = () => {
  const [friends, setFriends] = useState([
    { id: "1", name: "Abel Pintos" },
    { id: "2", name: "Carlos Alberto Troncoso" },
    { id: "3", name: "Abel Pintos" },
    { id: "4", name: "Pedro Andres Galarza" },
    { id: "5", name: "Abel Pintos" },
    { id: "6", name: "Abel Pintos" },
  ]);

  const handleRemove = (id: string) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
  };

  const renderFriend = ({ item }: { item: { id: string; name: string } }) => (
    <Div
      row
      alignItems="center"
      py={customTheme.spacing.small}
      px={customTheme.spacing.large}
      justifyContent="space-between"
      mb={customTheme.spacing.small}
    >
      <Div row alignItems="center">
        <Image
          style={{ width: scale(22), height: scale(22) }}
          resizeMode="cover"
          source={require("../assets/user1.png")}
        />
        <Text
          ml={customTheme.spacing.medium}
          fontSize={customTheme.fontSize.small}
        >
          {" "}
          {item.name}
        </Text>
      </Div>
      <TouchableOpacity onPress={() => handleRemove(item.id)}>
        <Text fontFamily="bold" fontSize={customTheme.fontSize.small}>
          X
        </Text>
      </TouchableOpacity>
    </Div>
  );

  return (
    <Div
      flex={1}
      bg={customTheme.colors.background}
      p={customTheme.spacing.small}
    >
      <Text
        mb={customTheme.spacing.large}
        ml={customTheme.spacing.small}
        fontFamily="NotoSans-BoldItalic"
        fontSize={customTheme.fontSize.title}
      >
        Amigos
      </Text>

      {friends.length === 0 ? (
        <Div h={scale(285)} justifyContent="flex-end" alignItems="center">
          <Image
            style={{
              width: scale(79),
              height: verticalScale(75),
              alignSelf: "center",
            }}
            resizeMode="contain"
            source={require("../assets/search-no-result.png")}
          />
          <Text
            style={{
              fontSize: customTheme.fontSize.medium,
              color: customTheme.colors.gray,
              textAlign: "center",
              marginTop: customTheme.spacing.small,
            }}
          >
            No hay peticiones pendientes.
          </Text>
        </Div>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={renderFriend}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <Div
        justifyContent="center"
        bg={customTheme.colors.background}
        h={verticalScale(80)}
        p={customTheme.spacing.medium}
        borderTopColor="rgb(223, 223, 220)"
        borderTopWidth={1}
      >
        <TouchableOpacity
          style={{}}
          onPress={() => console.log("Invitar Amigos")}
        >
          <Div
            h={verticalScale(45)}
            justifyContent="center"
            alignItems="center"
            bg={customTheme.colors.secondaryBackground}
            flexDir="row"
          >
            <Text
              textAlign="center"
              color={customTheme.colors.background}
              fontSize={customTheme.fontSize.medium}
              fontFamily="NotoSans-BoldItalic"
            >
              Invitar Amigos
            </Text>
          </Div>
        </TouchableOpacity>
      </Div>
    </Div>
  );
};

export default FriendsScreen;
