import {View, Text, TextInput, Alert} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
  const [text, onChangeText] = React.useState('');
  const [pass, onChangePass] = React.useState('');
  const [error, setError] = React.useState('');

  const loginUser = () => {
    console.log('EMAIL, PASS', text, pass);
    //pass username and password
    setError('');
    auth()
      .signInWithEmailAndPassword(`${text}`, `${pass}`)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          setError('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          setError('That email address is invalid!');
        }
        setError(`${error}`);
        console.log(error);
      });
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
        <Text style={{color: 'black', fontSize: 24, fontWeight: 'bold'}}>
          Login
        </Text>

        <TextInput
          //   onFocus={() => setTextFocus(true)}
          //   onBlur={() => setTextFocus(false)}
          style={{
            marginTop: 40,
            // ...globaStytles.paragraph2Regular,
            width: '100%',
            height: 52,
            borderRadius: 8,
            paddingHorizontal: 16,
            color: '#1E2228',
            // borderColor: textFocus ? "#1E2228" : "#EFEFF0",
            borderWidth: 1.8,
          }}
          maxLength={30}
          placeholder="Email"
          placeholderTextColor={'#C8CACC'}
          onChangeText={onChangeText}
          selectionColor={'#1E2228'}
          //   autoFocus={false}
          value={text}
        />
        <TextInput
          style={{
            marginTop: 20,
            width: '100%',
            height: 52,
            borderRadius: 8,
            paddingHorizontal: 16,
            color: '#1E2228',
            borderWidth: 1.8,
          }}
          maxLength={6}
          secureTextEntry={true}
          placeholder="password"
          numeric
          placeholderTextColor={'#C8CACC'}
          onChangeText={onChangePass}
          selectionColor={'#1E2228'}
          keyboardType={'numeric'}
          value={pass}
        />
        <Text
          style={{
            color: 'red',
            fontSize: 12,
            marginTop: 8,
            fontWeight: 'bold',
          }}>
          {error}
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
            text === '' || pass === ''
              ? setError('Enter username and password')
              : loginUser();
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
          <Text style={{color: 'white', fontSize: 18}}>submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
