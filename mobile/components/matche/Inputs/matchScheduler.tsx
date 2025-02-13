import React, { useEffect, useState } from 'react'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Div, Text } from 'react-native-magnus'
import { customTheme } from '../../../utils/theme';
import { TouchableOpacity, View } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

LocaleConfig.locales['es'] = {
    monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    monthNamesShort: [
        'Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.',
        'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'
    ],
    dayNames: [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ],
    dayNamesShort: [
        'Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'
    ],
    today: 'Hoy'
};

LocaleConfig.defaultLocale = 'es';

const schedules = [
    { id: 1, time: '00:00' },
    { id: 2, time: '08:00' },
    { id: 3, time: '09:00' },
    { id: 4, time: '10:00' },
    { id: 5, time: '11:00' },
    { id: 6, time: '12:00' },
    { id: 7, time: '13:00' }
];

const MatchSchedulerInput = ({ setMatchDate }: { setMatchDate: React.Dispatch<React.SetStateAction<Date | null | undefined>> }) => {
    const [selected, setSelected] = useState<Date | null>(null);
    const [selectedHour, setSelectedHour] = useState<{ id: number, time: string }>({ id: 1, time: '00:00' })

    const changeTime = (date: Date, timeString: string): Date => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const newDate = new Date(date);
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
    }

    useEffect(() => {
        if (selected) setMatchDate(changeTime(selected, selectedHour.time))

    }, [selected, selectedHour])

    return (
        <Div px={customTheme.spacing.medium}>
            <Div mt={customTheme.spacing.medium}>
                <Text>¿Que día juegan?</Text>
            </Div>
            <Calendar
                locale={"es"}
                minDate={new Date()}
                onDayPress={day => {
                    setSelected(new Date(day.dateString));
                }}
                markedDates={
                    selected
                        ? { [selected.toISOString().split('T')[0]]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' } }
                        : {}
                }
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: customTheme.colors.secondaryBackground,
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#2d4150',
                    dayTextColor: '#2d4150',
                    textDisabledColor: customTheme.colors.grayBackground,
                    textDayFontFamily: 'NotoSans_Condensed-Black',
                    textMonthFontFamily: 'NotoSans_Condensed-Black',
                    textDayHeaderFontFamily: 'NotoSans_Condensed-Black',
                    arrowColor: customTheme.colors.secondaryBackground
                }}
            />

            <Div my={customTheme.spacing.medium}>
                <View style={{ width: '100%', borderBottomWidth: 1, borderStyle: "dotted" }} />
            </Div>
            <Text>¿A que hora juegan?</Text>
            <Div mt={customTheme.spacing.medium} style={{ gap: verticalScale(8) }}>
                {
                    schedules.map((schedule) => (
                        <TouchableOpacity onPress={() => setSelectedHour(schedule)}>
                            <Div h={verticalScale(48)} bg={selectedHour?.id === schedule.id ? customTheme.colors.secondaryBackground : 'white'} justifyContent='center' borderWidth={1}>
                                <Text color={selectedHour?.id === schedule.id ? 'white' : customTheme.colors.secondaryBackground} textAlign='center'>{schedule.time === '00:00' ? 'A definir' : schedule.time}</Text>
                            </Div>
                        </TouchableOpacity>
                    ))
                }
            </Div>
        </Div>
    )
}

export default MatchSchedulerInput