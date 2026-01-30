import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { signOut } from '../features/userSlice'
import type { AppDispatch } from '../store/store'
import { getCurrentTimestamp } from '../utils/utils'

export default function RatingScreen() {
  const dispatch = useDispatch<AppDispatch>()
  const { agent } = useSelector((state: any) => state.user)
  // const { livestockOperation } = useSelector((state: any) => state.farmer)

  const [rating, setRating] = useState(0)
  //const [subRating, setSubRating] = useState(0)
  const timestamp = getCurrentTimestamp()
  //const ratingSubQuestion = null // No sub-question in this implementation
  const ratingQuestion =
    agent.role === 'field_officer'
      ? 'How easy was it to register a farmer and livestock with Halisi Livestock?'
      : 'How satisfied are you with the livestock validation and verification reporting?'

  const ratings_Data = {
    mainRating: rating,
    subRating: null,
    institution_id: agent.institutions[0],
    agent_id: agent.agent_id,
    timestamp: timestamp,
    process: 'FO_Registration',
  }
  const onSubmitClick = async (star) => {
    setRating(star)
    try {
      let data = {
        record: ratings_Data,
      }
      const response = await axios.post(
        'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/createratings',
        data,
      )
      if (response.data.status === 200) {
        console.log('Rating submitted successfully')
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleSignOut = () => {
    dispatch(signOut())
    router.replace('/')
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ratingQuestion}</Text>

      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => onSubmitClick(star)}>
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

      <TouchableOpacity
        style={[styles.button, rating === 0 && styles.buttonDisabled]}
        onPress={handleSignOut}
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
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
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
