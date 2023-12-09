import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Platform, Pressable, TextInput, Button } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { styles } from '../styles/styles';

import { db, firestore, auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import {ref, set, get, onValue} from 'firebase/database'

    const FirstScreen = (props) => {
        const [loginEmail, setLoginEmail] = useState('');
        const [loginPassword, setLoginPassword] = useState('');
        const [resetPassword, setResetPassword] = useState(false);
        const [isLoggedIn, setIsLoggedIn] = useState(false);
        
        useEffect(() => {
          // if (loginEmail.length > 0 && loginPassword.length > 0) {
          //   setResetPassword(true);
          // } else {
          //   setResetPassword(false);
          // }
          setResetPassword(false);
          setIsLoggedIn(false);
        }, [loginEmail, loginPassword]);
        
        const loginWithFirebase = () => {
            if (loginEmail.length < 4) {
              Alert.alert('Please enter an email address.');
              return;
            }
        
            if (loginPassword.length < 4) {
              Alert.alert('Please enter a password.');
              return;
            }
        
            signInWithEmailAndPassword(auth, loginEmail, loginPassword)
              .then((_firebaseUser) => {
                Alert.alert('Logged in!');
                setIsLoggedIn(true);
                setLoginEmail('');
                setLoginPassword('');
                //navigate to LoggedInScreen
              props.navigation.navigate('ScreenTwo', { screenTitle: "Logged In" })
              })
              .catch(function (error) {
                let errorCode = error.code;
                let errorMessage = error.message;
                setResetPassword(true);
                setIsLoggedIn(false);

                if (errorCode === 'auth/wrong-password') {
                  Alert.alert('Wrong password.');
                }
                else {
                  Alert.alert(errorMessage);
                }
              })
              .finally(() => {
                setLoginEmail('');
                setLoginPassword('');
              });
        }

        //if user enters the wrong password display the reset passowrd button
        //send them an email to reset their password
        const resetFirebasePassword = async () => {
          try {
            await sendPasswordResetEmail(auth, loginEmail);

            await firestore.collection('users').add({
              email,
              resetPasswordTimestamp: new Date(), 
            });
            console.log('Password reset email sent.');
            Alert.alert('Password reset email sent.');

          } catch (error) {
            console.log(error);
            Alert.alert('Error sending password reset email.');
          }
        }
        
        return (
            <View style={styles.form}>
            <View>
            <Text style={styles.headerLabel}>Emergency Contacts App!</Text>
            </View>
            <View>
            <TextInput
              style={styles.textInput}
              value= {loginEmail}
              onChangeText={ (value) => setLoginEmail(value) }
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="email"
              keyboardType="email-address"
              placeholder="email"
            />
            <TextInput
              style={styles.textInput}
              value= {loginPassword}
              onChangeText={ (value) => setLoginPassword(value) }
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="password"
              keyboardType="visible-password"
              placeholder="password"
              secureTextEntry = {false}
            />
            </View>
            <View>
            <Pressable style={styles.button}
            onPress={loginWithFirebase}> 
            <Text style={styles.text}>Login</Text>
            </Pressable>
            </View>
            {resetPassword && 
            <View>
              <Pressable style={styles.button}
              onPress={resetFirebasePassword}>
              <Text style={styles.text}>Reset Password</Text>
              </Pressable>
            </View>
            }
            <View style={styles.buttonContainer}>
            <Pressable style={styles.registerButton}
            onPress={() => props.navigation.navigate('ScreenThree', { screenTitle: "Register" })}> 
            <Text style={styles.text}>Register</Text>
            </Pressable>
            </View>
          </View>
        );
    }
    export default FirstScreen;