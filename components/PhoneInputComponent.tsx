import { useEffect, useState } from 'react'
import { Text, TextInput, View } from 'react-native'

export default function PhoneInputField({
  label,
  value,
  onChangeText,
  error,
  numbersOnly = true,
  prefix,
}: {
  label: string
  value: string
  onChangeText: (text: string) => void
  error?: string
  numbersOnly?: boolean
  prefix?: string
}) {
  const [internalError, setInternalError] = useState<string | undefined>()

  const MAX_LENGTH = 9
  const isValidPrefix = prefix === '+254' || prefix === '+243'

  const handleChange = (text: string) => {
    let cleaned = text

    if (numbersOnly) {
      cleaned = cleaned.replace(/[^0-9]/g, '')
    }

    // Remove leading zero
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.slice(1)
    }

    // Enforce max length
    if (cleaned.length > MAX_LENGTH) {
      cleaned = cleaned.slice(0, MAX_LENGTH)
    }

    onChangeText(cleaned)
  }

  useEffect(() => {
    if (!prefix) {
      setInternalError('Select country first')
      return
    }

    if (!isValidPrefix) {
      setInternalError('Invalid country code')
      return
    }

    if (value.length > MAX_LENGTH) {
      setInternalError('Phone number must be 9 digits')
      return
    }

    if (value.length > 0 && value.length < MAX_LENGTH) {
      setInternalError(undefined)
      return
    }

    setInternalError(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prefix])

  const showError = error || internalError

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <Text>{label}</Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: showError ? 'red' : '#ccc',
          borderRadius: 6,
          paddingHorizontal: 10,
        }}
      >
        {prefix && (
          <Text
            style={{
              marginRight: 6,
              color: '#555',
              fontWeight: '600',
            }}
          >
            {prefix}
          </Text>
        )}

        <TextInput
          style={{ flex: 1 }}
          value={value}
          onChangeText={handleChange}
          keyboardType='phone-pad'
          placeholder='712345678'
          maxLength={MAX_LENGTH}
        />
      </View>

      {showError && (
        <Text style={{ color: 'red', marginTop: 4 }}>{showError}</Text>
      )}
    </View>
  )
}
