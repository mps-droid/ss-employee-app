import { View, Text, StatusBar, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useState } from 'react'
import images from '../../assets/images'
import { tw } from '../../utils/styling'
import { useNavigation } from '@react-navigation/native'

export default  MyAppointments = () => {
  const [selected, setSelected] = useState('Upcoming');
  const navigation = useNavigation();
  const [upcoming, setUpcoming] = useState([0,1,2,3,4]);
  const [completed, setCompleted] = useState([1,2,3]);
  const renderUpcoming = (item , index) => {
    return (
      <>
      <TouchableOpacity onPress={() => navigation.navigate("BookingDetails")} key={index} style={tw`border-[.3px] rounded-lg  border-neutral-400 py-3 px-3 my-2 bg-sky-100  `}>
        <View style={tw`flex-row items-center justify-between`}>
          <Text style={tw`text-neutral-700`}>#CO12314</Text>
          <Text style={tw`bg-yellow-500 text-white  px-3 py-[2px] rounded-full`}>Upcoming</Text>
        </View>
        <View style={tw`flex-row items-center justify-between`}>

        <View style={tw`my-1 flex-row items-center gap-2 `}>
          <Image
          style={tw` h-12 w-12 rounded-md`}
          source={{
            uri : 'https://images.unsplash.com/photo-1707343848655-a196bfe88861?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }}
          />
          <View style={tw`gap-1 `}>
            <Text
            style={tw`font-semibold text-neutral-800`}
            >
              John Parker
            </Text>
            <Text
            style={tw`text-neutral-800 font-medium`}
            >
            Water Analysis
            </Text>
          </View>
        </View>
        <Text style={tw`text-[#086FB1] font-medium `}>
          $120
        </Text>
        </View>

      <View style={tw` flex-row items-center gap-2 pt-2 `}>
        <Image source={images.calendar}/>
        <Text style={tw`text-neutral-500 text-[12px]`}>
        07 JAN 2022 10:00 AM
        </Text>

      </View>
      </TouchableOpacity>
          </>
    )
  }
  const renderCompleted = (item , index) => {
    return (
      <>
      <TouchableOpacity key={index} onPress={() => navigation.navigate('BookingDetails') } style={tw`border-[.3px] rounded-lg  border-neutral-400 py-3 px-3 my-2 bg-sky-100  `}>
        <View style={tw`flex-row items-center justify-between`}>
          <Text style={tw`text-neutral-700`}>#CO12314</Text>
          <Text style={tw`bg-green-500 text-white  px-3 py-[2px] rounded-full`}>Completed</Text>
        </View>
        <View style={tw`flex-row items-center justify-between`}>

<View style={tw`my-1 flex-row items-center gap-2 `}>
  <Image
  style={tw` h-12 w-12 rounded-md`}
  source={{
    uri : 'https://images.unsplash.com/photo-1707343848655-a196bfe88861?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }}
  />
  <View style={tw`gap-1 `}>
    <Text
    style={tw`font-semibold text-neutral-800`}
    >
      John Parker
    </Text>
    <Text
    style={tw`text-neutral-800 font-medium`}
    >
    Water Analysis
    </Text>
  </View>
</View>
<Text style={tw`text-[#086FB1] font-medium `}>
  $120
</Text>
</View>
      <View style={tw` flex-row items-center gap-2 pt-2 `}>
        <Image source={images.calendar}/>
        <Text style={tw`text-neutral-500 text-[12px]`}>
        07 JAN 2022 10:00 AM
        </Text>

      </View>
      </TouchableOpacity>
          </>
    )
  }
  return (
    <View style={tw`flex-1 `}>
    <StatusBar backgroundColor="#086FB1" barStyle="light-content" />

    <View style={tw`h-[12%] bg-[#086FB1] flex-row   `}>

<Text style={tw`text-white my-auto text-xl font-medium  mx-8  `}>
 My Appointments
</Text>

</View>

<View style={tw`flex-row items-center justify-center my-5 border-[1px] self-center border-sky-200 rounded-lg p-1 gap-2 mx-8  bg-white `} >
  <TouchableOpacity
  onPress={() => setSelected('Upcoming')}
  style={tw`${selected == 'Upcoming' ? 'bg-[#086FB1]' : 'bg-white'} items-center w-[45%] py-3    rounded-lg  `}
  ><Text
  style={tw`${selected == 'Upcoming'  ? 'text-white' : 'text-[#086FB1]' }`}
  >Upcoming</Text></TouchableOpacity>
  <TouchableOpacity
  onPress={() => setSelected('Completed')}
  style={tw`${selected == 'Completed' ? 'bg-[#086FB1]'  : 'bg-white'} w-[45%] items-center py-3 rounded-lg   `}
  ><Text
  style={tw`${selected == 'Completed' ? 'text-[#fff]'  : 'text-[#086FB1]'} `}
  >Completed</Text></TouchableOpacity>

</View>
<ScrollView showsVerticalScrollIndicator={false} style={tw`mx-8 mb-4`}>
{
  selected == 'Upcoming' ?

  upcoming.map((item , index) => {
    return renderUpcoming(item , index)
  })

  :
completed.map((item , index) => {
  return renderCompleted(item , index)
})

}
</ScrollView>
    </View>
  )
}
