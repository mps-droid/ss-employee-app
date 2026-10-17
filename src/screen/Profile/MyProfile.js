import { View, Text, StatusBar, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import images from '../../assets/images';
import { tw } from '../../utils/styling';

const MyProfile = () => {
  const navigation = useNavigation();
  return (
    <View style={tw`flex-1 `}>
    <StatusBar backgroundColor="#086FB1" barStyle="light-content" />

    <View style={tw`h-[12%] bg-[#086FB1] flex-row  px-8 gap-4   `}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2   h-8 w-8  items-center justify-center  my-auto bg-transparent border-[.5px] border-white  rounded-full  `}>

  <Image source={images.back} tintColor={'#fff'} style={tw`w-4 h-4  `}/>

</TouchableOpacity>

<Text style={tw`text-white my-auto text-xl font-medium  `}>
  My Profile
</Text>

</View>
<View style={tw`flex-1 justify-between `}>

<View>

<View style={tw`w-[90%] self-center   my-4 items-center gap-4  `}>
  <Image
  style={tw`h-22 w-22  rounded-full `}
  source={{
    uri : 'https://images.unsplash.com/photo-1707343848655-a196bfe88861?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }}
  />

</View>

<View style={tw`w-[90%] self-center my-3 gap-5 `}>
 <View style={tw` w-[100%] self-center gap-2`}>
<Text style={tw`text-neutral-800 `}>Name</Text>
<View style={tw`bg-sky-100 border-[.3px] border-neutral-400 py-4 px-4 rounded-lg `}>
  <Text style={tw`text-neutral-800 `}>John Doe</Text>
</View>
 </View>
 <View style={tw` w-[100%] self-center gap-2`}>
<Text style={tw`text-neutral-800 `}>Email ID</Text>
<View style={tw`bg-sky-100 border-[.3px] border-neutral-400 py-4 px-4 rounded-lg `}>
  <Text style={tw`text-neutral-800 `}>johndoe@gmail.com</Text>
</View>
 </View>
 <View style={tw` w-[100%] self-center gap-2`}>
<Text style={tw`text-neutral-800 `}>Phone Number</Text>
<View style={tw`bg-sky-100 border-[.3px] border-neutral-400 py-4 px-4 rounded-lg `}>
  <Text style={tw`text-neutral-800 `}>+01 232424 2322</Text>
</View>
 </View>

</View>

</View>

<TouchableOpacity
onPress={() => navigation.navigate('EditProfile')}
style={tw` items-center justify-between border-[.3px] my-3 border-neutral-400 bg-[#086FB1]  w-[90%] rounded-full  py-4  px-3 self-center `}
>
  <Text
  style={tw`text-white text-base `}
  >
    Edit Profile
  </Text>
</TouchableOpacity>

</View>

    </View>
  )
}

export default MyProfile
