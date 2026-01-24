import { Pressable, Text, View } from 'react-native'

type Option = {
  label: string
  value: string
}

type Props = {
  label?: string
  options: Option[]
  selectedValues: string[]
  onChange: (values: string[]) => void
}

export default function CheckboxGroup({
  label,
  options,
  selectedValues,
  onChange,
}: Props) {
  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value))
    } else {
      onChange([...selectedValues, value])
    }
  }

  return (
    <View>
      {label && (
        <Text style={{ fontWeight: '600', marginBottom: 8 }}>{label}</Text>
      )}

      {options.map((option) => {
        const checked = selectedValues.includes(option.value)

        return (
          <Pressable
            key={option.value}
            onPress={() => toggleValue(option.value)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderWidth: 1,
                borderColor: '#555',
                marginRight: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {checked && (
                <View
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: '#555',
                  }}
                />
              )}
            </View>

            <Text>{option.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}
