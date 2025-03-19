import React from 'react'
import { View } from 'react-native'
import useFetch from '../../../hooks/useGet'
import matchService from '../../../service/match.service'
import { QUERY_KEYS } from '../../../types/query.types'
import { Div, Text } from 'react-native-magnus'
import { customTheme } from '../../../utils/theme'
import Match from '../../../types/match.type'

const PlayerStatusList = ({ match }: { match: Match }) => {

  const { data: statusList } = useFetch(() => matchService.getPlayerInvitations(match._id), [QUERY_KEYS.PLAYERS_STATUS])

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
      <Div h={'20%'} p={customTheme.spacing.small}>
        <Text textAlign='center'>Estado de jugadores</Text>
      </Div>
      <Div w={"100%"} flexDir='row' justifyContent='space-between'>
        <Div w='50%' h={10} bg={customTheme.colors.grayBackground} rounded='md' my={customTheme.spacing.xs}>
          <Div
            w={`${acceptedPercentage}%`}
            h='100%'
            bg='green500'
            rounded='md'
          />
        </Div>
        <Text textAlign='right'>Confirmados ({`${statusList?.accepted.length}`})</Text>
      </Div>
      {
        statusList?.accepted.map((person) => (
          <Div>
            <Text>{person.name}</Text>
          </Div>
        ))
      }
      <Div borderBottomWidth={1} borderColor='grey' my={customTheme.spacing.medium} />

      <Div w={"100%"} flexDir='row' justifyContent='space-between'>
        <Div w='50%' h={10} bg={customTheme.colors.grayBackground} rounded='md' my={customTheme.spacing.xs}>
          <Div
            w={`${pendingPercentage}%`}
            h='100%'
            bg='yellow500'
            rounded='md'
          />
        </Div>
        <Text textAlign='right'>A confirmar ({`${statusList?.pending.length}`})</Text>
      </Div>
      {
        statusList?.pending.map((person) => (
          <Div>
            <Text>{person.name}</Text>
          </Div>
        ))
      }
      <Div borderBottomWidth={1} borderColor='grey' my={customTheme.spacing.medium} />
      <Div w={"100%"} flexDir='row' justifyContent='space-between'>
        <Div w='50%' h={10} bg={customTheme.colors.grayBackground} rounded='md' my={customTheme.spacing.xs}>
          <Div
            w={`${declinedPercentage}%`}
            h='100%'
            bg='red500'
            rounded='md'
          />
        </Div>
        <Text textAlign='right'>No aceptaron ({`${statusList?.declined.length}`})</Text>
      </Div>
      {
        statusList?.declined.map((person) => (
          <Div>
            <Text>{person.name}</Text>
          </Div>
        ))
      }
    </Div>)
}

export default PlayerStatusList
