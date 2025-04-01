import React, { useEffect, useState } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Div, Text } from "react-native-magnus";
import { customTheme } from "../../../utils/theme";
import { TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene.",
    "Feb.",
    "Mar.",
    "Abr.",
    "May.",
    "Jun.",
    "Jul.",
    "Ago.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dic.",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom.", "Lun.", "Mar.", "Mié.", "Jue.", "Vie.", "Sáb."],
  today: "Hoy",
};

LocaleConfig.defaultLocale = "es";

const schedules = [
  { id: 1, time: "00:00" },
  { id: 2, time: "08:00" },
  { id: 3, time: "09:00" },
  { id: 4, time: "10:00" },
  { id: 5, time: "11:00" },
  { id: 6, time: "12:00" },
  { id: 7, time: "13:00" },
];

interface MatchSchedulerInputProps {
  matchDetailsRef?: React.MutableRefObject<{
    matchDate: Date | null | undefined;
  }>;
  date?: Date | null;
  readOnly?: boolean;
}

export default function MatchSchedulerInput({
  matchDetailsRef,
  date,
  readOnly = false,
}: MatchSchedulerInputProps) {
  const [selected, setSelected] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<{
    id: number;
    time: string;
  }>({
    id: 1,
    time: "00:00",
  });

  useEffect(() => {
    if (readOnly) return;
    if (!matchDetailsRef) return;
    if (selected) {
      const newDate = changeTime(selected, selectedHour.time);
      matchDetailsRef.current.matchDate = newDate;
    }
  }, [selected, selectedHour, readOnly, matchDetailsRef]);

  function changeTime(baseDate: Date, timeString: string) {
    const [hours, minutes] = timeString.split(":").map(Number);
    const newDate = new Date(baseDate);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  }

  function formatDateTime(d: Date | null | undefined): string {
    if (!d) return "A definir";

    const weekdayMap: Record<string, string> = {
      "dom.": "Do",
      "lun.": "Lu",
      "mar.": "Ma",
      "mié.": "Mi",
      "jue.": "Ju",
      "vie.": "Vi",
      "sáb.": "Sa",
    };
    const rawDayOfWeek = d
      .toLocaleDateString("es-ES", { weekday: "short" })
      .toLowerCase();
    const dayOfWeek = weekdayMap[rawDayOfWeek] ?? rawDayOfWeek;

    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear().toString().slice(-2);
    const hour = d.getHours().toString();
    const minute = d.getMinutes().toString().padStart(2, "0");

    // Ejemplo: "Vi 10/01/25 9:00 hs"
    return `${dayOfWeek} ${day}/${month}/${year} ${hour}:${minute} hs`;
  }

  let displayDate: Date | null = null;
  if (readOnly) {
    if (date) {
      displayDate = date;
    } else if (matchDetailsRef?.current.matchDate) {
      displayDate = matchDetailsRef.current.matchDate;
    }
  }

  // SOLO LECTURA PA MOSTRAR EN PANTALLA DE CREADO
  // =======================
  if (readOnly) {
    return (
      <Div p={customTheme.spacing.small}>
        <Div   borderWidth={1} rounded="md" p={customTheme.spacing.small}>
          <Div h={scale(25)} flexDir="row" justifyContent="space-between" alignItems="center">
            <Text fontFamily="NotoSans-Variable">Horario</Text>
            <Text fontFamily="NotoSans-BoldItalic">
              {formatDateTime(displayDate)}
            </Text>
          </Div>
        </Div>
      </Div>
    );
  }

  // =======================

  return (
    <Div px={customTheme.spacing.medium}>
      <Div mt={customTheme.spacing.medium}>
        <Text>¿Qué día juegan?</Text>
      </Div>
      <Calendar
        locale="es"
        minDate={new Date()}
        onDayPress={(day) => {
          const [year, month, dayOfMonth] = day.dateString.split("-").map(Number);
          const localDate = new Date(year, month - 1, dayOfMonth, 12); // 12:00 PM para evitar problemas de conversión
          setSelected(localDate);
        }}
        markedDates={
          selected
            ? {
                [selected.toISOString().split("T")[0]]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedDotColor: "orange",
                },
              }
            : {}
        }
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#b6c1cd",
          selectedDayBackgroundColor: customTheme.colors.secondaryBackground,
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#2d4150",
          dayTextColor: "#2d4150",
          textDisabledColor: "white",
          textDayFontFamily: "NotoSans_Condensed-Black",
          textMonthFontFamily: "NotoSans_Condensed-Black",
          textDayHeaderFontFamily: "NotoSans_Condensed-Black",
          arrowColor: customTheme.colors.secondaryBackground,
        }}
      />

      <Div my={customTheme.spacing.medium}>
        <View
          style={{
            width: "100%",
            borderBottomWidth: 1,
            borderStyle: "dotted",
          }}
        />
      </Div>
      <Text>¿A qué hora juegan?</Text>
      <Div mt={customTheme.spacing.medium}>
        {schedules.map((schedule) => (
          <TouchableOpacity
            key={schedule.id}
            onPress={() => setSelectedHour(schedule)}
          >
            <Div
              h={verticalScale(48)}
              bg={
                selectedHour?.id === schedule.id
                  ? customTheme.colors.secondaryBackground
                  : "white"
              }
              justifyContent="center"
              borderWidth={1}
              mb={5}
            >
              <Text
                color={
                  selectedHour?.id === schedule.id
                    ? "white"
                    : customTheme.colors.secondaryBackground
                }
                textAlign="center"
              >
                {schedule.time === "00:00" ? "A definir" : schedule.time}
              </Text>
            </Div>
          </TouchableOpacity>
        ))}
      </Div>
    </Div>
  );
}
