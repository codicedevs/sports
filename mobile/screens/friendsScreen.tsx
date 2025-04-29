import React, { useState } from "react";
import { FlatList, TouchableOpacity, Image } from "react-native";
import { Div, Text } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";
import { customTheme } from "../utils/theme";
import { useSession } from "../context/authProvider";


const API_BASE = "http://192.168.1.150:4002";

const FriendsScreen = () => {
  const { currentUser } = useSession();

  const [friends, setFriends] = useState([
    { id: "1", name: "Abel Pintos" },
    { id: "2", name: "Carlos Alberto Troncoso" },
    { id: "3", name: "Abel Pintos" },
    { id: "4", name: "Pedro Andres Galarza" },
    { id: "5", name: "Abel Pintos" },
    { id: "6", name: "Abel Pintos" },
  ]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleRemove = (id: string) => {
    setFriends(prev => prev.filter(f => f.id !== id));
    setSelectedIds(prev => prev.filter(s => s !== id));
    setErrorMap(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleSendInvites = async () => {
    
    const toInvite = selectedIds.filter(id => !sentRequests.includes(id));
    if (!toInvite.length) return;

    setLoadingIds(prev => [...prev, ...toInvite]);
    const newErrors = { ...errorMap };

    for (const friendId of toInvite) {
      try {
        const res = await fetch(
          `${API_BASE}/users/${currentUser._id}/friends/${friendId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);

        setSentRequests(prev => [...prev, friendId]);
        delete newErrors[friendId];
      } catch (err: any) {
        newErrors[friendId] = err.message || "Ocurrió un error";
      }
    }

    setErrorMap(newErrors);
    setLoadingIds(prev => prev.filter(id => !toInvite.includes(id)));
  };

  const renderFriend = ({ item }: { item: { id: string; name: string } }) => {
    const isSelected = selectedIds.includes(item.id);
    const isLoading = loadingIds.includes(item.id);
    const isSent = sentRequests.includes(item.id);
    const error = errorMap[item.id];

    return (
      <TouchableOpacity onPress={() => toggleSelect(item.id)}>
        <Div
          row
          alignItems="center"
          justifyContent="space-between"
          py={customTheme.spacing.small}
          px={customTheme.spacing.large}
          mb={customTheme.spacing.small}
          bg={isSelected ? customTheme.colors.secondaryBackground : undefined}
          rounded="md"
        >
          <Div row alignItems="center">
            <Image
              style={{ width: scale(22), height: scale(22) }}
              resizeMode="cover"
              source={require("../assets/user1.png")}
            />
            <Text ml={customTheme.spacing.medium} fontSize={customTheme.fontSize.small}>
              {item.name}
            </Text>
          </Div>

          <Div row alignItems="center">
            {isSent && <Text color="green">✅</Text>}
            {isLoading && <Text ml="sm">Enviando...</Text>}
            <TouchableOpacity onPress={() => handleRemove(item.id)} style={{ marginLeft: 10 }}>
              <Text fontFamily="bold" fontSize={customTheme.fontSize.small}>
                X
              </Text>
            </TouchableOpacity>
          </Div>
        </Div>

        {error && (
          <Text color="red" fontSize={customTheme.fontSize.tiny} ml="lg">
            {error}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Div flex={1} bg={customTheme.colors.background} p={customTheme.spacing.small}>
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
            style={{ width: scale(79), height: verticalScale(75) }}
            resizeMode="contain"
            source={require("../assets/search-no-result.png")}
          />
          <Text
            color={customTheme.colors.gray}
            fontSize={customTheme.fontSize.medium}
            textAlign="center"
            mt={customTheme.spacing.small}
          >
            No hay peticiones pendientes.
          </Text>
        </Div>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={item => item.id}
          renderItem={renderFriend}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      <Div
        justifyContent="center"
        h={verticalScale(80)}
        p={customTheme.spacing.medium}
        borderTopWidth={1}
        borderTopColor="rgb(223, 223, 220)"
        bg={customTheme.colors.background}
      >
        <TouchableOpacity onPress={handleSendInvites}>
          <Div
            h={verticalScale(45)}
            alignItems="center"
            justifyContent="center"
            bg={customTheme.colors.secondaryBackground}
            rounded="lg"
          >
            <Text
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
