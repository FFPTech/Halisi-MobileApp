import React from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import FormStepWrapper from './FormStepWrapper'

export default function OverviewScreen() {
  return (
    <FormStepWrapper title={'Overview'}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* ===================== */}
        {/* MAIN HEADING */}
        {/* ===================== */}

        <Text style={styles.mainHeading}>Review Details to Proceed</Text>

        <View>
          <Text style={styles.item}>Halisis Ownership Certificate </Text>
        </View>

        <View
          style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={styles.item}>Number:</Text>
          <Text style={[styles.item, { fontWeight: 'bold', marginLeft: 5 }]}>
            123456789
          </Text>
        </View>

        {/* ===================== */}
        {/* FARMER INFORMATION */}
        {/* ===================== */}

        <Text style={styles.sectionHeading}>Farmer Information</Text>

        {/* Space for Farmer Image */}
        <View style={styles.imageContainer}>
          {/* Replace require() with your actual image */}
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1595211877493-41a4e5f236b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhlYWRzaG90fGVufDB8fDB8fHww',
            }}
            style={styles.image}
          />
        </View>

        <Text style={styles.item}>First Name: Ella</Text>
        <Text style={styles.item}>Surname: John</Text>
        <Text style={styles.item}>
          National Identification Number: 120120120
        </Text>
        <Text style={styles.item}>County/Province: Kasai</Text>
        <Text style={styles.item}>Mobile Phone: +243258963147</Text>
        <Text style={styles.item}>Monthly Income (USD): 25</Text>
        <Text style={styles.item}>Experience (years): 2</Text>

        <Text style={styles.item}>Country: Democratic Republic of Congo</Text>
        <Text style={styles.item}>Gender: Female</Text>
        <Text style={styles.item}>Age Category: 18-30 years old</Text>
        <Text style={styles.item}>Schooling: High School</Text>
        <Text style={styles.item}>Place of Living: Ward</Text>
        <Text style={styles.item}>Residential Status: Rent</Text>
        <Text style={styles.item}>
          Customer tenure with Financial Institution: Old (5+ years)
        </Text>
        <Text style={styles.item}>Annual Income (USD): 2000</Text>
        <Text style={styles.item}>Cooperative Membership: No</Text>
        <Text style={styles.item}>KRA PIN: kra_pin</Text>
        <Text style={styles.item}>Farmer Town: Bukavu</Text>
        <Text style={styles.item}>RCCM Number: 12344678abc</Text>

        {/* ===================== */}
        {/* LIVESTOCK INFORMATION */}
        {/* ===================== */}

        <Text style={styles.sectionHeading}>Livestock Information</Text>

        {/* Space for Livestock Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1595211877493-41a4e5f236b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhlYWRzaG90fGVufDB8fDB8fHww',
            }}
            style={styles.image}
          />
        </View>

        <Text style={styles.item}>
          Livestock Identification Number: 400400400
        </Text>
        <Text style={styles.item}>Birthdate: 2026-02-02</Text>
        <Text style={styles.item}>Estimated Market Value (USD): 50</Text>
        <Text style={styles.item}>Livestock weight (Kgs.): 40</Text>
        <Text style={styles.item}>Livestock Breed: Ayrshire</Text>
        <Text style={styles.item}>Livestock purpose: Breeding stock</Text>
        <Text style={styles.item}>Health Status: Healthy</Text>
        <Text style={styles.item}>Veterinary Care: Yes</Text>
        <Text style={styles.item}>Number of calvings: 3</Text>
        <Text style={styles.item}>Sex: Female</Text>
        <Text style={styles.item}>
          General health status: Healthy skin and body
        </Text>
        <Text style={styles.item}>Production stage: Bred</Text>
        <Text style={styles.item}>
          Vaccination history: East Coast Fever (ECF), Rift Valley Fever (RVF),
          Foot & Mouth Disease (FMD)
        </Text>
        <Text style={styles.item}>
          Livestock Veterinarian ID Number: 690889870148f53ea3b61007
        </Text>
        <Text style={styles.item}>
          Expected Monthly Milk Production (in litres): 10
        </Text>
        <Text style={styles.item}>
          Actual Monthly Milk Production (in litres): 100
        </Text>

        {/* ===================== */}
        {/* CONFIRM BUTTON */}
        {/* ===================== */}

        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmText}>CONFIRM</Text>
        </TouchableOpacity>
      </ScrollView>
    </FormStepWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    overflow: 'hidden',
  },
  image: {
    width: 300,
    height: 250,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  item: {
    fontSize: 16,
    marginBottom: 8,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
