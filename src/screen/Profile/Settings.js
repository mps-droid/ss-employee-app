import { View, Text, StatusBar, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { tw } from '../../utils/styling'
import { useNavigation } from '@react-navigation/native';
import images from '../../assets/images';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const Settings = () => {
  const navigation = useNavigation();
  return (
    <View style={tw`flex-1 `}>
    <StatusBar backgroundColor="#086FB1" barStyle="light-content" />

    <View style={tw`h-[12%] bg-[#086FB1] flex-row  px-8 gap-4   `}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2   h-8 w-8  items-center justify-center  my-auto bg-transparent border-[.5px] border-white  rounded-full  `}>

  <Image source={images.back} tintColor={'#fff'} style={tw`w-4 h-4  `}/>

</TouchableOpacity>

<Text style={tw`text-white my-auto text-xl font-medium  `}>
  Settings
</Text>

</View>
<View style={tw`w-[90%] self-center my-8 gap-5 `}>
  <TouchableOpacity
  style={tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-lg px-3  py-4  `}
  >

  <Text style={tw`text-neutral-800  text-base`}>Change Password</Text>
  <Image source={images.arrowRight} tintColor={'#000'} style={tw`w-5 h-5  `}/>

  </TouchableOpacity>
  <TouchableOpacity
  style={tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-lg px-3  py-4  `}
  >

  <Text style={tw`text-neutral-800  text-base`}>Delete Account </Text>
  <Image source={images.arrowRight} tintColor={'#000'} style={tw`w-5 h-5  `}/>

  </TouchableOpacity>
  <View
  style={tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-lg px-3  py-4  `}
  >

  <Text style={tw`text-neutral-800  text-base`} > Allow Notifications </Text>
  <BouncyCheckbox fillColor='#086FB1' />

  </View>
  <View
  style={tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-lg px-3  py-4  `}
  >

  <Text style={tw`text-neutral-800  text-base`} > Sync with Calendar </Text>
  <BouncyCheckbox fillColor='#086FB1' />

  </View>
</View>
    </View>
  )
}

export default Settings
