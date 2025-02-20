import React, { useState } from 'react'
import { AppScreenProps, AppScreens } from '../navigation/screens'
import { Text, View } from 'react-native'
import matchService from '../service/match.service'
import useFetch from '../hooks/useGet'
import { QUERY_KEYS } from '../types/query.types'
import MatchModalHandler from '../components/modal/matchModalHandler'
import { Button } from 'react-native-magnus'

const MatchDetail: React.FC<AppScreenProps<AppScreens.MATCH_DETAIL>> = ({
    route
}) => {
    const { id } = route.params;
    const [open, setOpen] = useState(false)

    const fetchMatchInfo = async () => {
        const res = await matchService.getById(id)
        return res.data
    }

    const { data: match, isFetching } = useFetch(fetchMatchInfo, [QUERY_KEYS.MATCH])
    return (
        <View>
            <Text>{match?.name}</Text>
            {
                !isFetching &&
                <>
                    <Button onPress={() => setOpen(true)}>Editar partido</Button>
                    <MatchModalHandler open={false} setOpen={setOpen} match={match} />
                </>
            }
        </View>
    )
}

export default MatchDetail
