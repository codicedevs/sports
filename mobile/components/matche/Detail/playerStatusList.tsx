import React from 'react'
import { Image, ScrollView, View } from 'react-native'
import useFetch from '../../../hooks/useGet'
import matchService from '../../../service/match.service'
import { QUERY_KEYS } from '../../../types/query.types'
import { Div, Text } from 'react-native-magnus'
import { customTheme } from '../../../utils/theme'
import Match from '../../../types/match.type'
import { scale } from 'react-native-size-matters'

const PlayerStatusList = ({ match }: { match: Match }) => {

  const { data: statusList } = useFetch(() => matchService.getPlayerInvitations(match._id), [QUERY_KEYS.PLAYERS_STATUS, match])
   if (!statusList) return
  const acceptedPercentage = match.playersLimit
    ? (statusList.accepted.length / match.playersLimit) * 100
    : 0

  const declinedPercentage = match.playersLimit
    ? (statusList.declined.length / match.playersLimit) * 100
    : 0

  const pendingPercentage = match.playersLimit
    ? (statusList.pending.length / match.playersLimit) * 100
    : 0

  return (
    <Div px={customTheme.spacing.large}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Div w={"100%"} flexDir='row' justifyContent='space-between' mb={customTheme.spacing.small}>
          <Div w='50%' h={10} bg={"white"} rounded='md' my={customTheme.spacing.xs}>
            <Div
              w={`${acceptedPercentage}%`}
              h='100%'
              bg='green500'
              rounded='md'
            />
          </Div>
          <Text fontFamily='NotoSans-Italic' textAlign='right'>Confirmados ({`${statusList?.accepted.length}`})</Text>
        </Div>
        <Div style={{ gap: 5 }}>
          {
            statusList?.accepted.map((person) => (
              <Div flexDir='row'>
                <Image style={{ width: scale(18), height: scale(18), marginRight: customTheme.spacing.small }} source={require("../../../assets/match/profileIcon.png")} />
                {/* <Text>{person.name}</Text> */}
              </Div>
            ))
          }
        </Div>
        <Div borderBottomWidth={1} borderColor={customTheme.colors.lightGray} my={customTheme.spacing.medium} />

        <Div w={"100%"} flexDir='row' justifyContent='space-between' mb={customTheme.spacing.small}>
          <Div w='50%' h={10} bg={"white"} rounded='md' my={customTheme.spacing.xs}>
            <Div
              w={`${pendingPercentage}%`}
              h='100%'
              bg='yellow500'
              rounded='md'
            />
          </Div>
          <Text fontFamily='NotoSans-Italic' textAlign='right'>A confirmar ({`${statusList?.pending.length}`})</Text>
        </Div>
        <Div style={{ gap: 5 }}>
          {
            statusList?.pending.map((person) => (
              <Div flexDir='row'>
                <Image style={{ width: scale(18), height: scale(18), marginRight: customTheme.spacing.small }} source={require("../../../assets/match/profileIcon.png")} />
                {/* <Text>{person.name}</Text> */}
              </Div>
            ))
          }
        </Div>
        <Div borderBottomWidth={1} borderColor={customTheme.colors.lightGray} my={customTheme.spacing.medium} />
        <Div w={"100%"} flexDir='row' justifyContent='space-between' mb={customTheme.spacing.small}>
          <Div w='50%' h={10} bg={"white"} rounded='md' my={customTheme.spacing.xs}>
            <Div
              w={`${declinedPercentage}%`}
              h='100%'
              bg='red500'
              rounded='md'
            />
          </Div>
          <Text fontFamily='NotoSans-Italic' textAlign='right'>No aceptaron ({`${statusList?.declined.length}`})</Text>
        </Div>
        <Div style={{ gap: 5 }}>
          {
            statusList?.declined.map((person) => (
              <Div flexDir='row'>
                <Image style={{ width: scale(18), height: scale(18), marginRight: customTheme.spacing.small }} source={require("../../../assets/match/profileIcon.png")} />
                {/* <Text>{person.name}</Text> */}
              </Div>
            ))
          }
        </Div>
        <Div borderBottomWidth={1} borderColor={customTheme.colors.lightGray} my={customTheme.spacing.medium} />
      </ScrollView>
    </Div>)
}

export default PlayerStatusList
