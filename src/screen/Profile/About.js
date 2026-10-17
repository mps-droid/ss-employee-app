import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import images from '../../assets/images'
import { TouchableOpacity } from 'react-native'
import { tw } from '../../utils/styling'
import { useNavigation } from '@react-navigation/native'

const About = () => {
  const navigation = useNavigation()
  return (
    <SafeAreaView style={styles.container}>
       <View style={[tw`h-[10%] flex-row items-center px-2`, {  }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
        <Image source={images.back} style={{height:20,width:20}} />

        </TouchableOpacity>
        <Text style={tw`text-black text-xl font-medium flex-1 text-center pr-10`}>
          About Us
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={images.people} style={{ height: 200, width: '88%',marginHorizontal:0,alignSelf:'center' }} />

        <Text style={[tw`text-black text-m font-medium flex-1 text-center `, { textAlign: 'justify', marginHorizontal: 26, marginTop: 20 }]}>
          Welcome to Social Sanitation. We are Central Florida’s #1 Rated Commercial Cleaning Company. We’ve been in operation since the start of the COVID-19 pandemic. Our main operating office is located in Tampa, FL. We currently service areas of Central Florida, in counties such as: Hillsborough County, Pinellas County, Polk County, Pasco County and more.

          Since 2019, the COVID-19 pandemic has taken over our work environment and caused a social divide. We bring reassurance to our customers, safety first. Our refined sanitizing methods make your workplace a safe environment for both staff employees, and their customers. A clean and safe work environment is key to promoting future business and maintaining stability in the workplace. We’re here to make your workplace great again.
        </Text>
        </ScrollView>

    </SafeAreaView>
  )
}

export default About

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 15 },
  titleTxt: { fontSize: 22, fontWeight: "bold", marginVertical: 15, color: "#3D2C1D", marginHorizontal: 20 },
})
