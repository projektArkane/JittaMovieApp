import {View, Text, Button} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/dist/Ionicons';

GoogleSignin.configure({
  webClientId:
    '1083167590472-j2eh0p9uk8q51pplf7n3v8o9vs2dcb5a.apps.googleusercontent.com',
});

async function onGoogleButtonPress() {
  // Get the users ID token
  const {idToken} = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}

const FirstScreen = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: 'black', fontSize: 24, fontWeight: 'bold'}}>
          TMDB MOVIE APP
        </Text>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          height: 200,
          paddingHorizontal: 20,
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SignupScreen');
          }}
          style={{
            width: '100%',
            height: 50,
            backgroundColor: 'black',
            borderRadius: 50 / 2,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Text style={{color: 'white', fontSize: 18}}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('LoginScreen');
          }}
          style={{
            width: '100%',
            height: 50,
            backgroundColor: 'black',
            borderRadius: 50 / 2,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Text style={{color: 'white', fontSize: 18}}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            onGoogleButtonPress().then(() =>
              console.log('Signed in with Google!'),
            )
          }
          style={{
            width: '100%',
            height: 50,
            backgroundColor: '#4285F4',
            borderRadius: 50 / 2,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon name={'logo-google'} color={'white'} size={24} />
          <Text style={{color: 'white', fontSize: 18, paddingLeft: 18}}>
            Sign in with Google
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FirstScreen;
