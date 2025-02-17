import React, { useState } from 'react'
import { Div, Text } from 'react-native-magnus'
import { MatchDetails } from '../../../types/form.type'
import { customTheme } from '../../../utils/theme'
import { scale, verticalScale } from 'react-native-size-matters'
import { TouchableOpacity } from 'react-native'

interface SportInputProps {
  matchDetailsRef: React.MutableRefObject<MatchDetails>
}

const dayNames = [
  { id: 0, value: 'Domingo', label: 'Do' },
  { id: 1, value: 'Lunes', label: 'Lu' },
  { id: 2, value: 'Martes', label: 'Ma' },
  { id: 3, value: 'Miércoles', label: 'Mi' },
  { id: 4, value: 'Jueves', label: 'Ju' },
  { id: 5, value: 'Viernes', label: 'Vi' },
  { id: 6, value: 'Sábado', label: 'Sa' }
]

const schedules = [
  { id: 1, time: '00:00' }, // "Todos los horarios"
  { id: 2, time: '08:00' },
  { id: 3, time: '09:00' },
  { id: 4, time: '10:00' },
  { id: 5, time: '11:00' },
  { id: 6, time: '12:00' },
  { id: 7, time: '13:00' }
]

const DateTimePreferenceInput = ({ matchDetailsRef }: SportInputProps) => {
  const [selectedHours, setSelectedHours] = useState<number[]>([])
  const [selectedDays, setSelectedDays] = useState<number[]>([])

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev =>
      prev.includes(dayId) ? prev.filter(id => id !== dayId) : [...prev, dayId]
    )
  }

  const toggleSchedule = (scheduleId: number) => {
    if (scheduleId === 1) {
      // Al seleccionar "Todos los horarios" (id 1)
      if (selectedHours.includes(1)) {
        // Si ya está seleccionado, lo deseleccionamos
        setSelectedHours(selectedHours.filter(id => id !== 1))
      } else {
        // Si no está seleccionado, se selecciona y se eliminan los demás
        setSelectedHours([1])
      }
    } else {
      // Para horarios distintos a "Todos los horarios"
      if (selectedHours.includes(scheduleId)) {
        // Si ya está seleccionado, lo deseleccionamos
        setSelectedHours(selectedHours.filter(id => id !== scheduleId))
      } else {
        // Al seleccionar un horario que no es id 1, se deselecciona "Todos los horarios"
        setSelectedHours(prev => {
          const withoutAll = prev.filter(id => id !== 1)
          return [...withoutAll, scheduleId]
        })
      }
    }
  }

  return (
    <Div p={customTheme.spacing.medium}>
      <Text>¿Qué día juegan?</Text>
      <Div mt={customTheme.spacing.medium} flexDir="row" style={{ gap: verticalScale(6) }}>
        {dayNames.map(day => (
          <TouchableOpacity key={day.id} onPress={() => toggleDay(day.id)}>
            <Div
              w={scale(35)}
              h={verticalScale(35)}
              justifyContent="center"
              rounded="circle"
              bg={
                selectedDays.includes(day.id)
                  ? customTheme.colors.secondaryBackground
                  : 'white'
              }
              borderWidth={1}
              borderColor={customTheme.colors.secondaryBackground}
            >
              <Text
                textAlign="center"
                color={
                  selectedDays.includes(day.id)
                    ? 'white'
                    : customTheme.colors.secondaryBackground
                }
              >
                {day.label}
              </Text>
            </Div>
          </TouchableOpacity>
        ))}
      </Div>
      <Div
        borderBottomWidth={1}
        my={customTheme.spacing.medium}
        borderBottomColor={customTheme.colors.gray}
      />
      <Text>¿A Qué hora juegan?</Text>
      <Div mt={customTheme.spacing.medium} style={{ gap: verticalScale(8) }}>
        {schedules.map((schedule, index) => (
          <TouchableOpacity key={index} onPress={() => toggleSchedule(schedule.id)}>
            <Div
              h={verticalScale(48)}
              bg={
                selectedHours.includes(schedule.id)
                  ? customTheme.colors.secondaryBackground
                  : 'white'
              }
              justifyContent="center"
              borderWidth={1}
            >
              <Text
                color={
                  selectedHours.includes(schedule.id)
                    ? 'white'
                    : customTheme.colors.secondaryBackground
                }
                textAlign="center"
              >
                {schedule.time === '00:00' ? 'Todos los horarios' : schedule.time}
              </Text>
            </Div>
          </TouchableOpacity>
        ))}
      </Div>
    </Div>
  )
}

export default DateTimePreferenceInput
