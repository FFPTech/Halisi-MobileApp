import React, { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

export default function RequestScreen() {
  const [selectedProduct, setSelectedProduct] = useState('Loan')
  const [amount, setAmount] = useState(12000)
  const [duration, setDuration] = useState(12)

  const increaseAmount = () => setAmount(amount + 1000)
  const decreaseAmount = () => setAmount(amount > 0 ? amount - 1000 : 0)

  const increaseDuration = () => setDuration(duration + 1)
  const decreaseDuration = () => setDuration(duration > 1 ? duration - 1 : 1)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ================= */}
      {/* REQUEST TITLE */}
      {/* ================= */}

      <Text style={styles.heading}>Request</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Select your product</Text>

        <View style={styles.productContainer}>
          <TouchableOpacity
            style={[
              styles.loanButton,
              selectedProduct === 'Loan' && styles.activeLoan,
            ]}
            onPress={() => setSelectedProduct('Loan')}
          >
            <Text style={styles.loanText}>Loan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.insuranceButton,
              selectedProduct === 'Insurance' && styles.activeInsurance,
            ]}
            onPress={() => setSelectedProduct('Insurance')}
          >
            <Text
              style={[
                styles.insuranceText,
                selectedProduct === 'Insurance' && { color: '#fff' },
              ]}
            >
              Insurance
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= */}
        {/* AMOUNT */}
        {/* ================= */}

        <Text style={styles.label}>Amount</Text>

        <View style={styles.counterRow}>
          <TouchableOpacity style={styles.circle} onPress={decreaseAmount}>
            <Text style={styles.circleText}>-</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={amount.toString()}
            keyboardType='numeric'
          />

          <TouchableOpacity style={styles.circle} onPress={increaseAmount}>
            <Text style={styles.circleText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* ================= */}
        {/* DURATION */}
        {/* ================= */}

        <Text style={styles.label}>Duration</Text>

        <View style={styles.counterRow}>
          <TouchableOpacity style={styles.circle} onPress={decreaseDuration}>
            <Text style={styles.circleText}>-</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={duration.toString()}
            keyboardType='numeric'
          />

          <TouchableOpacity style={styles.circle} onPress={increaseDuration}>
            <Text style={styles.circleText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ================= */}
      {/* ACTION BUTTONS */}
      {/* ================= */}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.calculateButton}>
          <Text style={styles.calculateText}>CALCULATE RISK</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>SUBMIT REQUEST</Text>
        </TouchableOpacity>
      </View>

      {/* ================= */}
      {/* RISK CARD */}
      {/* ================= */}

      <View style={styles.riskCard}>
        <Text style={styles.riskTitle}>Medium Risk</Text>
        <Text style={styles.riskItem}>Loan Amount Requested: 11000 USD</Text>
        <Text style={styles.riskItem}>Loan Tenure (Months): 12 months</Text>
        <Text style={styles.riskItem}>Monthly Payment: 1,029.54 USD</Text>
        <Text style={styles.riskItem}>
          Total Refundable Amount: 12,354.46 USD
        </Text>
        <Text style={styles.riskItem}>Interest Rate (%): 22%</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#e9e9e9',
    padding: 20,
    borderRadius: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  loanButton: {
    flex: 1,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#4CAF50',
  },
  activeLoan: {
    backgroundColor: '#4CAF50',
  },
  loanText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  insuranceButton: {
    flex: 1,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  activeInsurance: {
    backgroundColor: '#4CAF50',
  },
  insuranceText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  circle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  calculateButton: {
    flex: 1,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 15,
    marginRight: 10,
    alignItems: 'center',
  },
  calculateText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#999',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  riskCard: {
    marginTop: 25,
    backgroundColor: '#F5A000',
    padding: 20,
    borderRadius: 15,
  },
  riskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  riskItem: {
    color: '#fff',
    marginBottom: 5,
  },
})
