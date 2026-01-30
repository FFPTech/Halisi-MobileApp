// components/DateInput.tsx
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import { Platform, Text, TouchableOpacity, View } from 'react-native'

interface DateInputProps {
  label?: string
  value: Date | null
  onChange: (date: Date) => void
  error?: string
}

export default function DateInput({
  label,
  value,
  onChange,
  error,
}: DateInputProps) {
  const [show, setShow] = useState(false)

  const formatted = value ? value.toLocaleDateString() : 'Select a date'

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShow(false)
    if (selectedDate) onChange(selectedDate)
  }

  return (
    <View style={{ marginVertical: 10 }}>
      {label && (
        <Text style={{ fontWeight: '600', marginBottom: 6 }}>{label}</Text>
      )}

      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 14,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: error ? 'red' : '#ccc',
          backgroundColor: '#fff',
        }}
        onPress={() => setShow(true)}
      >
        <Text style={{ color: value ? '#000' : '#999' }}>{formatted}</Text>
        <Ionicons
          name='calendar-outline'
          size={22}
          color={error ? 'red' : '#444'}
        />
      </TouchableOpacity>

      {error ? (
        <Text
          style={{
            color: 'red',
            marginTop: 4,
            fontSize: 12,
          }}
        >
          {error}
        </Text>
      ) : null}

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode='date'
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onDateChange}
        />
      )}
    </View>
  )
}
