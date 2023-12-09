import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { db, firestore, auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {ref, set, get, onValue} from 'firebase/database'
import {doc, setDoc, getDoc, onSnapshot} from 'firebase/firestore'

import { styles } from '../styles/styles';

const RegistrationScreen = () => {
    const [registrationEmail, setRegistrationEmail] = useState('');
    const [registrationPassword, setRegistrationPassword] = useState('');
    const [registrationFirstName, setRegistrationFirstName] = useState('');
    const [registrationLastName, setRegistrationLastName] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);


    const registerWithFirebase = () => {
        if (registrationEmail.length < 4) {
          Alert.alert('Please enter an email address.');
          return;
        }
    
        if (registrationPassword.length < 4) {
          Alert.alert('Please enter a password.');
          return;
        }
    
        createUserWithEmailAndPassword(auth, registrationEmail, registrationPassword)
          .then(function (_firebaseUser) {
            Alert.alert('user registered!');
            setRegistrationEmail('');
            setRegistrationPassword('');
            setRegistrationFirstName('');
            setRegistrationLastName('');
            saveDataWithFirebase();
          })
          .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
    
            if (errorCode == 'auth/weak-password') {
              Alert.alert('The password is too weak.');
            }
            else {
              Alert.alert(errorMessage);
            }
            console.log(error);
          }
          );
      }

      const saveDataWithFirebase = () =>
      {
        var userID = auth.currentUser.uid;
    
        // SAVE TO REALTIME DB
        set(ref(db, 'users/' + userID), {
            firstName : registrationFirstName,
            lastName : registrationLastName,
            email : registrationEmail,
            password : registrationPassword
        })
    
        // SAVE TO FIRESTORE
    
        setDoc(doc(firestore, 'users/' + userID),{
            firstName : registrationFirstName,
            lastName : registrationLastName,
            email : registrationEmail,
            password : registrationPassword
        },
        {
          merge : true
        })
        .then(()=>{
         console.log('Document Succesfully written')
        })
        .catch(()=>{
         console.log('Error writing document');
          console.log(error)
        })
      }
    
    return (
        <View style={styles.form}>
            <View>
            <Text style={styles.label}>Create your account below:</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={ (value) => setRegistrationFirstName(value) }
              autoCapitalize="none"
              autoCorrect = {false}
              autoCompleteType="name"
              placeholder="First Name"
            />
            <TextInput
              style={styles.textInput}
              onChangeText={ (value) => setRegistrationLastName(value) }
              autoCapitalize="none"
              autoCorrect = {false}
              autoCompleteType="name"
              placeholder="Last Name"
            />
            <TextInput
              style={styles.textInput}
              onChangeText={ (value) => setRegistrationEmail(value) }
              autoCapitalize="none"
              autoCorrect = {false}
              autoCompleteType="email"
              keyboardType="email-address"
              placeholder="email"
            />
            <TextInput
              style={styles.textInput}
              onChangeText={ (value) => setRegistrationPassword(value) }
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType= "password"
              keyboardType="visible-password"
              placeholder="password"
              secureTextEntry = {true}
            />
            <Pressable style={styles.button} 
            onPress={registerWithFirebase}>
            <Text style={styles.text}>Register</Text>
            </Pressable>
          </View>
        </View>
    );
}

export default RegistrationScreen;
