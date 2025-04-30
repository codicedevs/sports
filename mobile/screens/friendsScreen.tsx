// src/screens/FriendsScreen.tsx

import React, { useState, useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { Div, Text } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";
import useFetch from "../hooks/useGet";
import { QUERY_KEYS } from "../types/query.types";
import { customTheme } from "../utils/theme";
import { useSession } from "../context/authProvider";
import { fetchUsers, sendFriendRequest } from "../service/friendService";

interface RawUser { _id: string; name: string }
interface User    { id: string;  name: string }

const FriendsScreen = () => {
  const { currentUser } = useSession();
  const token = currentUser?.token;
  const userId = currentUser?._id; // tu propio ID

  // 1) fetch users
  const {
    data: usersData,
    isFetching: loadingUsers,
    refetch: refetchUsers,
  } = useFetch<{ results: RawUser[] }>(
    () => fetchUsers().then(r => r.data),
    [QUERY_KEYS.USERS]
  );

  // UI state
  const [friends, setFriends]           = useState<User[]>([]);
  const [selectedIds, setSelectedIds]   = useState<string[]>([]);
  const [loadingIds, setLoadingIds]     = useState<string[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [errorMap, setErrorMap]         = useState<Record<string,string>>({});

  // map raw to UI users
  useEffect(() => {
    if (!usersData) return;
    const mapped = usersData.results
      .map(u => ({ id: u._id, name: u.name }))
      .filter(u => u.id !== currentUser._id);
    setFriends(mapped);
  }, [usersData, currentUser._id]);

  // toggle selection
  const toggleSelect = (id: string) =>
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  // send invites: now includes userId
  const handleSendInvites = async () => {
    if (!userId) {
      Alert.alert("Error", "Usuario no identificado");
      return;
    }

    const toInvite = selectedIds.filter(id => !sentRequests.includes(id));
    if (!toInvite.length) return;

    setLoadingIds(prev => [...prev, ...toInvite]);
    const newErrs = { ...errorMap };

    for (const friendId of toInvite) {
      try {
        // ahora pasamos también userId
        await sendFriendRequest(userId, friendId);
        setSentRequests(prev => [...prev, friendId]);
        delete newErrs[friendId];
      } catch (e: any) {
        newErrs[friendId] = e.message || "Error al invitar";
        const name = friends.find(f => f.id === friendId)?.name ?? friendId;
        Alert.alert("Error al invitar", `No se pudo invitar a ${name}: ${e.message}`);
      }
    }

    setErrorMap(newErrs);
    setLoadingIds(prev => prev.filter(x => !toInvite.includes(x)));
    refetchUsers();
  };

  // loading
  if (loadingUsers) {
    return (
      <Div flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" />
      </Div>
    );
  }

  return (
    <Div flex={1} bg={customTheme.colors.background} p={customTheme.spacing.small}>
      <Text
        mb={customTheme.spacing.large}
        ml={customTheme.spacing.small}
        fontFamily="NotoSans-BoldItalic"
        fontSize={customTheme.fontSize.title}
      >
        Invitaciones
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
            No hay usuarios disponibles.
          </Text>
        </Div>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const isSel  = selectedIds.includes(item.id);
            const isLoad = loadingIds.includes(item.id);
            const isSent = sentRequests.includes(item.id);
            const err    = errorMap[item.id];

            return (
              <TouchableOpacity onPress={() => toggleSelect(item.id)}>
                <Div
                  row
                  alignItems="center"
                  justifyContent="space-between"
                  py={customTheme.spacing.small}
                  px={customTheme.spacing.medium}
                  mb={customTheme.spacing.small}
                  bg={isSel ? customTheme.colors.primary : undefined}
                  rounded="md"
                >
                  <Div row alignItems="center">
                    <Image
                      style={{ width: scale(23), height: scale(23) }}
                      resizeMode="cover"
                      source={require("../assets/user1.png")}
                    />
                    <Text
                      ml={customTheme.spacing.medium}
                      fontSize={customTheme.fontSize.small}
                      color={isSel ? customTheme.colors.background : undefined}
                    >
                      {item.name}
                    </Text>
                  </Div>
                  <Div row alignItems="center">
                    {isSent && <Text color="green">✅</Text>}
                    {isLoad && (
                      <ActivityIndicator
                        size="small"
                        color={customTheme.colors.primary}
                      />
                    )}
                  </Div>
                </Div>
                {err && (
                  <Text color="red" fontSize={customTheme.fontSize.tiny} ml="lg">
                    {err}
                  </Text>
                )}
              </TouchableOpacity>
            );
          }}
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
        <TouchableOpacity
          onPress={handleSendInvites}
          disabled={!selectedIds.length}
        >
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
