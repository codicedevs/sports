import React, { useState, useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { Div, Text } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";
import useFetch from "../hooks/useGet";
import { QUERY_KEYS } from "../types/query.types";
import { customTheme } from "../utils/theme";
import { useSession } from "../context/authProvider";
import { fetchUsers, setAuthToken } from "../service/friendService";
import InviteModal from "../components/modal/invitePlayer";

interface RawUser {
  _id: string;
  name: string;
}
interface User {
  _id: string;
  name: string;
}

interface FriendsScreenProps {
  matchId: string;
}

const FriendsScreen: React.FC<FriendsScreenProps> = ({ matchId }) => {
  const { currentUser } = useSession();
  const token = currentUser?.token;
  const userId = currentUser?._id;

  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const {
    data: usersData,
    isFetching: loadingUsers,
    refetch: refetchUsers,
    error: fetchError,
  } = useFetch<{ results: RawUser[] }>(
    () => fetchUsers().then((r) => r.data),
    [QUERY_KEYS.USERS]
  );

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      refetchUsers();
    }
  }, [token, refetchUsers]);

  const [friends, setFriends] = useState<User[]>([]);
  useEffect(() => {
    if (!usersData || !userId || !currentUser.friends) return;

    const friendIds = (currentUser.friends || []).map((f: any) =>
      typeof f === "string" ? f : f._id
    );

    const onlyFriends = usersData.results.filter(
      (user) => user._id !== userId && friendIds.includes(user._id)
    );

    setFriends(onlyFriends);
  }, [usersData, userId, currentUser.friends]);

  const handleRemove = (id: string) => {
    setFriends((prev) => prev.filter((u) => u._id !== id));
  };

  if (!currentUser || !currentUser._id) {
    return (
      <Div flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={customTheme.colors.primary} />
      </Div>
    );
  }

  if (loadingUsers) {
    return (
      <Div flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={customTheme.colors.primary} />
      </Div>
    );
  }

  if (fetchError) {
    return (
      <Div flex={1} justifyContent="center" alignItems="center">
        <Text color="red">Error cargando usuarios: {fetchError.message}</Text>
      </Div>
    );
  }

  return (
    <>
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
              No hay datos.
            </Text>
          </Div>
        ) : (
          <FlatList
            data={friends}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Div
                row
                alignItems="center"
                justifyContent="space-between"
                py={customTheme.spacing.small}
                px={customTheme.spacing.medium}
                mb={customTheme.spacing.small}
                bg={customTheme.colors.surface}
                rounded="md"
              >
                <Div row alignItems="center" flex={1}>
                  <Image
                    style={{ width: scale(23), height: scale(23) }}
                    resizeMode="cover"
                    source={require("../assets/user1.png")}
                  />
                  <Text
                    ml={customTheme.spacing.medium}
                    fontSize={customTheme.fontSize.small}
                  >
                    {item.name}
                  </Text>
                </Div>
                <TouchableOpacity
                  onPress={() => handleRemove(item._id)}
                  style={{ padding: 8 }}
                >
                  <Text
                    fontSize={customTheme.fontSize.medium}
                    color={customTheme.colors.danger}
                  >
                    X
                  </Text>
                </TouchableOpacity>
              </Div>
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}

        <Div
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h={verticalScale(80)}
          p={customTheme.spacing.medium}
          borderTopWidth={1}
          borderTopColor="rgb(223, 223, 220)"
          bg={customTheme.colors.background}
        >
          <TouchableOpacity onPress={() => setInviteModalOpen(true)}>
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
                Agregar Amigos
              </Text>
            </Div>
          </TouchableOpacity>
        </Div>

        <InviteModal
          open={inviteModalOpen}
          setOpen={setInviteModalOpen}
          reference="friends"
        />
      </Div>
    </>
  );
};

export default FriendsScreen;
