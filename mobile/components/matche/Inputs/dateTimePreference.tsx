import React, { useState, useEffect } from 'react'
import { Div, Text } from 'react-native-magnus'
import { Profile } from '../../../types/form.type'
import { customTheme } from '../../../utils/theme'
import { scale, verticalScale } from 'react-native-size-matters'
import { TouchableOpacity } from 'react-native'

interface SportInputProps {
  matchDetailsRef: React.MutableRefObject<Profile>
}

const dayNames = [
  { id: 'Sunday', label: 'Su' },
  { id: 'Monday', label: 'Mo' },
  { id: 'Tuesday', label: 'Tu' },
  { id: 'Wednesday', label: 'We' },
  { id: 'Thursday', label: 'Th' },
  { id: 'Friday', label: 'Fr' },
  { id: 'Saturday', label: 'Sa' }
]

const schedules = [
  { id: 1, time: '00:00', value: { startHour: '08:00', endHour: '14:00' } },
  { id: 2, time: '08:00', value: { startHour: '08:00', endHour: '09:00' } },
  { id: 3, time: '09:00', value: { startHour: '09:00', endHour: '10:00' } },
  { id: 4, time: '10:00', value: { startHour: '10:00', endHour: '11:00' } },
  { id: 5, time: '11:00', value: { startHour: '11:00', endHour: '12:00' } },
  { id: 6, time: '12:00', value: { startHour: '12:00', endHour: '13:00' } },
  { id: 7, time: '13:00', value: { startHour: '13:00', endHour: '14:00' } }
]

const DateTimePreferenceInput = ({ matchDetailsRef }: SportInputProps) => {
  const [currentDay, setCurrentDay] = useState('Sunday')
  const [selectedUserDays, setSelectedUserDays] = useState<Record<string, any[]>>({})

  useEffect(() => {
    if (matchDetailsRef.current.availability && matchDetailsRef.current.availability.length > 0) {
      const preSelectedDays: Record<string, { startHour: string; endHour: string }[]> = {};
      matchDetailsRef.current.availability.forEach(avail => {
        preSelectedDays[avail.day] = avail.intervals.map(interval => ({
          startHour: interval.startHour.toString().padStart(2, '0') + ":00",
          endHour: interval.endHour.toString().padStart(2, '0') + ":00"
        }));
      });
      setSelectedUserDays(preSelectedDays);
    } else {
      setSelectedUserDays({});
    }
  }, []);

  useEffect(() => {
    const availabilities = Object.keys(selectedUserDays).map(dayKey => {
      const day = dayKey as "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
      const intervals = selectedUserDays[dayKey].map((schedule: { startHour: string; endHour: string }) => {
        const startHour = parseInt(schedule.startHour.split(':')[0], 10);
        const endHour = parseInt(schedule.endHour.split(':')[0], 10);
        return { startHour, endHour };
      });
      return { day, intervals };
    });
    matchDetailsRef.current.availability = availabilities;
  }, [selectedUserDays, matchDetailsRef]);

  const getDayStyles = (dayId: string) => {
    const key = String(dayId)
    if (currentDay === key) {
      return { bg: customTheme.colors.primary, textColor: 'black' }
    } else if (selectedUserDays[key] && selectedUserDays[key].length > 0) {
      return { bg: 'black', textColor: 'white' }
    }
    return { bg: 'white', textColor: customTheme.colors.secondaryBackground }
  }

  const toggleSchedule = (schedule: typeof schedules[0]) => {
    setSelectedUserDays(prev => {
      const currentSchedules = prev[currentDay] || []
      const exists = currentSchedules.some(
        s => s.startHour === schedule.value.startHour && s.endHour === schedule.value.endHour
      )

      let updatedSchedules: { startHour: string; endHour: string }[]

      if (exists) {
        updatedSchedules = currentSchedules.filter(
          s =>
            s.startHour !== schedule.value.startHour ||
            s.endHour !== schedule.value.endHour
        )
      } else {
        if (schedule.id === 1) {
          updatedSchedules = [schedule.value]
        } else {
          updatedSchedules = currentSchedules.filter(
            s =>
              s.startHour !== schedules[0].value.startHour ||
              s.endHour !== schedules[0].value.endHour
          )
          updatedSchedules.push(schedule.value)
        }
      }

      return {
        ...prev,
        [currentDay]: updatedSchedules,
      }
    })
  }

  return (
    <Div p={customTheme.spacing.medium}>
      <Text>¿Qué día juegan?</Text>
      <Div mt={customTheme.spacing.medium} flexDir="row" style={{ gap: verticalScale(6) }}>
        {dayNames.map(day => {
          const { bg, textColor } = getDayStyles(day.id)
          return (
            <TouchableOpacity key={day.id} onPress={() => setCurrentDay(String(day.id))}>
              <Div
                w={scale(35)}
                h={verticalScale(35)}
                justifyContent="center"
                rounded="circle"
                bg={bg}
                borderWidth={1}
                borderColor={customTheme.colors.secondaryBackground}
              >
                <Text textAlign="center" color={textColor}>
                  {day.label}
                </Text>
              </Div>
            </TouchableOpacity>
          )
        })}
      </Div>
      <Div borderBottomWidth={1} my={customTheme.spacing.medium} borderBottomColor={customTheme.colors.gray} />
      <Text>¿A Qué hora juegan?</Text>
      <Div mt={customTheme.spacing.medium} style={{ gap: verticalScale(8) }}>
        {schedules.map((schedule, index) => {
          const currentSchedules = selectedUserDays[currentDay] || []
          const isSelected = currentSchedules.some(
            s => s.startHour === schedule.value.startHour && s.endHour === schedule.value.endHour
          )

          return (
            <TouchableOpacity key={index} onPress={() => toggleSchedule(schedule)}>
              <Div
                h={verticalScale(48)}
                bg={isSelected ? customTheme.colors.secondaryBackground : 'white'}
                justifyContent="center"
                borderWidth={1}
              >
                <Text
                  color={isSelected ? 'white' : customTheme.colors.secondaryBackground}
                  textAlign="center"
                >
                  {schedule.time === '00:00' ? 'Todos los horarios' : schedule.time}
                </Text>
              </Div>
            </TouchableOpacity>
          )
        })}
      </Div>
    </Div>
  )
}

export default DateTimePreferenceInput
