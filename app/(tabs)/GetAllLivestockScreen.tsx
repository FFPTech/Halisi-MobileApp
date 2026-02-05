import axios from 'axios'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'

import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import CommonButton from '../../components/CommonButtonComponent'
import {
  queryLivestockDB,
  setOperationLivestock,
  setShowGoToRegistration,
} from '../../features/farmerSlice'
import { useUser } from '../../Hooks/useUserGlobal'
import type { AppDispatch } from '../../store/store'

export default function LivestockCardList() {
  const { agent } = useSelector((state: any) => state.user)
  const { recordId, enrollLivestockDbData } = useSelector(
    (state: any) => state.farmer,
  )
  const dispatch = useDispatch<AppDispatch>()
  const { setStep } = useUser()

  const [herdData, setHerdData] = useState([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const base64Header = 'data:image/jpeg;base64,'

  const getHerd = () => {
    const data = {
      farmer_record_id: recordId,
      agent_id: agent.agent_id,
      institution_id: '',
      env: 'Qua',
    }

    axios
      .post(
        'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/getHerd',
        data,
      )
      .then((response) => {
        const res = response.data
        if (res?.all_herd_data && Array.isArray(res.all_herd_data[1])) {
          setHerdData(res.all_herd_data[1])
        } else {
          setHerdData([])
        }
      })
      .catch(() => setHerdData([]))
  }

  useEffect(() => {
    getHerd()
  }, [])

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }
  console.log(enrollLivestockDbData)

  // dispatch(queryLivestockDB({ livestockTagNumber: livestocktag, agent }))

  // Navigate to next page
  // const handleConfirm = () => {
  //   if (!isSuccess) {
  //     setShowMakeSelectionAlert(true)
  //   } else {
  //     query_db()
  //     goToAlternateStep()
  //   }
  // }

  const handleConfirm = () => {
    router.replace('/(tabs)/FarmerForm')
    setStep(3)
    dispatch(setShowGoToRegistration(true))
    console.log(
      dispatch(queryLivestockDB({ livestockTagNumber: selectedId, agent })),
    )

    console.log('DB Data', enrollLivestockDbData)

    dispatch(setOperationLivestock('update'))
  }

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return '#2E7D32' // green
      case 'Not approved':
        return '#D32F2F' // red
      case 'Credit Request Submitted':
        return '#1976D2' // blue
      case 'No request':
        return '#9E9E9E' // gray
      default:
        return '#555555'
    }
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={herdData}
        keyExtractor={(item, index) =>
          item.livestock_record_id ?? index.toString()
        }
        contentContainerStyle={[
          styles.listContent,
          herdData.length === 0 && styles.emptyContainer,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            This farmer does not have any registered livestock.
          </Text>
        }
        renderItem={({ item }) => {
          const isSelected = item.livestock_id_number === selectedId

          return (
            <Pressable onPress={() => handleSelect(item.livestock_id_number)}>
              <View style={[styles.card, isSelected && styles.selectedCard]}>
                <Image
                  source={{
                    uri: item.face_image
                      ? base64Header + item.face_image
                      : undefined,
                  }}
                  style={styles.image}
                />

                <View style={styles.info}>
                  <Text style={styles.label}>Halisi ID:</Text>
                  <Text style={styles.halisiId}>
                    {item.livestock_record_id}
                  </Text>

                  <Text style={styles.text}>
                    Livestock ID: {item.livestock_id_number}
                  </Text>

                  <Text
                    style={[
                      styles.status,
                      {
                        color:
                          item.status?.toLowerCase() === 'verified'
                            ? '#2e7d32' // green
                            : '#d32f2f', // red
                      },
                    ]}
                  >
                    Livestock Status: {item.status}
                  </Text>

                  <Text
                    style={[
                      styles.text,
                      {
                        color: getRequestStatusColor(item.request_status),
                        fontWeight: '600',
                      },
                    ]}
                  >
                    Request Status: {item.request_status}
                  </Text>
                </View>
              </View>
            </Pressable>
          )
        }}
      />

      <View style={styles.buttonContainer}>
        <CommonButton
          title='Confirm'
          onPress={handleConfirm}
          disabled={!selectedId || herdData.length === 0}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },

  listContent: {
    padding: 16,
    paddingBottom: 120,
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 4,
  },

  selectedCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },

  image: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  halisiId: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },

  text: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },

  status: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#eee',
  },
})
