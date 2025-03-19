import React from 'react'
import { View } from 'react-native'
import useFetch from '../../../hooks/useGet'
import matchService from '../../../service/match.service'
import { QUERY_KEYS } from '../../../types/query.types'
import { Text } from 'react-native-magnus'

const PlayerStatusList = ({matchId} : {matchId: string}) => {

const {data:statusList} = useFetch(() => matchService.getPlayerInvitations(matchId), [QUERY_KEYS.PLAYERS_STATUS])
console.log(statusList)
  return (
    <View>
      <Text>Aceptado</Text>
      {
        statusList?.accepted.map((person) => (
          <View>
            <Text>{person.name}</Text>
          </View>
        ))
      }
       <Text>Denegado</Text>
      {
        statusList?.declined.map((person) => (
          <View>
            <Text>{person.name}</Text>
          </View>
        ))
      }
       <Text>Pendiente</Text>
      {
        statusList?.pending.map((person) => (
          <View>
            <Text>{person.name}</Text>
          </View>
        ))
      }
    </View>
  )
}

export default PlayerStatusList
