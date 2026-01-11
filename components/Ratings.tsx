import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAppDispatch } from '../Hooks/hook'
import { useUser } from '../Hooks/useUserGlobal'
import { signOut } from '../features/userSlice'

export default function RatingScreen() {
  const { logout } = useUser()
  const dispatch = useAppDispatch()
  const [rating, setRating] = useState(0)

  const handleSubmitRating = () => {
    // safe place to send rating to API / navigate
    console.log('User rating:', rating)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Your Experience</Text>

      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={40}
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.ratingText}>
        {rating > 0
          ? `You rated ${rating} star${rating > 1 ? 's' : ''}`
          : 'Tap a star to rate'}
      </Text>

      {/* CTA Button */}
      <TouchableOpacity
        style={[styles.button, rating === 0 && styles.buttonDisabled]}
        onPress={() => dispatch(signOut())}
        disabled={rating === 0}
      >
        <Text style={styles.buttonText}>Thank you</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  star: {
    marginHorizontal: 5,
    color: '#f5a623',
  },
  ratingText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#f5a623',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonDisabled: {
    backgroundColor: '#f0d9a6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
