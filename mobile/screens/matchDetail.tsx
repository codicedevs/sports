import React, { useEffect, useState } from 'react'
import { AppScreenProps, AppScreens } from '../navigation/screens'
import { Text, View } from 'react-native'
import matchService from '../service/match.service'
import useFetch from '../hooks/useGet'
import { QUERY_KEYS } from '../types/query.types'

const MatchDetail: React.FC<AppScreenProps<AppScreens.MATCH_DETAIL>> = ({
    route
}) => {
    const {id} = route.params;

    const fetchMatchInfo = async () => {
        const res = await matchService.getById(id)
        return res.data
    }

const {data:match} = useFetch({fn:fetchMatchInfo,key:[QUERY_KEYS.MATCH]}) 

    useEffect(() => {
        fetchMatchInfo()
    },[])

    return (
        <View>
            <Text>{match?.name}</Text>
        </View>
    )
}

export default MatchDetail
