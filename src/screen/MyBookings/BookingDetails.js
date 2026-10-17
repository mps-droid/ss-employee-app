import { View, Text, StatusBar, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { tw } from '../../utils/styling'
import images from '../../assets/images'
import { useNavigation } from '@react-navigation/native'

const BookingDetails = () => {
    const navigation = useNavigation();
  return (
    <View style={tw`flex-1 `}>
    <StatusBar backgroundColor="#086FB1" barStyle="light-content" />

    <View style={tw`h-[12%] bg-[#086FB1] flex-row  px-8 gap-4   `}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2   h-8 w-8  items-center justify-center  my-auto bg-transparent border-[.5px] border-white  rounded-full  `}>

  <Image source={images.back} tintColor={'#fff'} style={tw`w-4 h-4  `}/>

</TouchableOpacity>

<Text style={tw`text-white my-auto text-xl font-medium  `}>
 My Bookings
</Text>

</View>

<View style={tw`w-[90%] self-center my-3 `}>

<View  style={tw`border-[.3px] rounded-lg  border-neutral-400 py-3 px-3 my-2 bg-sky-100  `}>
        <View style={tw`flex-row items-center justify-between`}>
          <Text style={tw`text-neutral-700`}>#CO12314</Text>
          <Text style={tw`bg-green-500 text-white  px-3 py-[2px] rounded-full`}>Completed</Text>
        </View>
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
              Service Name
            </Text>
            <Text
            style={tw`text-[#086FB1] font-medium`}
            >
              $120
            </Text>
          </View>
        </View>
      <View style={tw` flex-row items-center gap-2 pt-2 `}>
        <Image source={images.calendar}/>
        <Text style={tw`text-neutral-500 text-[12px]`}>
        07 JAN 2022 10:00 AM
        </Text>

      </View>
      </View>

      <TouchableOpacity style={tw`w-[100%] self-center bg-[#086FB1] items-center mt-2 mb-6  py-4 rounded-full  `}>
        <Text style={tw`text-lg font-medium text-white  uppercase`}>
          Start Job
        </Text>
      </TouchableOpacity>

        <View style={tw`mt-4 bg-sky-100 border-[.4px] border-neutral-400 rounded-lg  px-3 py-3 my-2 gap-3 `}>
        <View>
<View style={tw`flex-row items-center justify-between mt-2 mb-1 `}>

            <Text style={tw` font-medium text-neutral-700`}>
            Address
            </Text>
            <TouchableOpacity>

          <Text style={tw`text-[#086FB1] font-bold`}>Get Directions</Text>
            </TouchableOpacity>
</View>
            <Text style={tw`text-neutral-600 text-[12px]`}>
           Suite 120, 44 Street Park NY 1234 Jamieton Road VA 1234
            </Text>
        </View>
        <View>

            <Text style={tw` font-medium text-neutral-700`}>
           Notes
            </Text>
            <Text style={[tw`text-neutral-600 text-[12px] ` , {letterSpacing : .6 }]}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non risus nec ante tincidunt fringilla.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non risus nec ante tincidunt fringilla.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non risus nec ante tincidunt fringilla.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non risus nec ante tincidunt fringilla.

            </Text>
        </View>
            </View>

            <View  style={tw`border-[.3px] rounded-lg  border-neutral-400 py-4 px-3 gap-2  my-2 bg-sky-100  `}>
        <Text
        style={tw`text-neutral-700 font-medium text-base `}
        >
            Service Provider Details
        </Text>
        <View style={tw`flex-row items-center justify-between  `}>

        <View style={tw`my-1 flex-row items-center gap-2 `}>
          <Image
          style={tw` h-12 w-12 rounded-full `}
          source={{
            uri : 'https://images.unsplash.com/photo-1707343848655-a196bfe88861?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }}
          />
          <View style={tw`gap-1 `}>
            <Text
            style={tw`font-semibold text-neutral-800`}
            >
             John Harper
            </Text>
            <Text
            style={tw`text-neutral-700 font-medium`}
            >
              +1 123 456 7890
            </Text>
          </View>
        </View>
        <TouchableOpacity style={tw`px-4 py-1  mx-4  flex-row items-center gap-3  my-auto bg-[#086FB1] rounded-full  `}>
        <Text
        style={tw`text-white font-medium`}
        >
            Call
        </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={tw`w-[100%] self-center   mx-4  my-5  items-center border-[.4px] border-neutral-400 gap-3 py-3   bg-[#fff] rounded-lg  `}
      >
        <Text
        style={tw`text-red-500 text-base uppercase font-medium`}
        >
            Cancel Booking
        </Text>
      </TouchableOpacity>
</View>

    </View>
  )
}

export default BookingDetails
