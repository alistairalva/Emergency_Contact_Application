import React, { useState, useEffect } from 'react';
import { Button, FlatList, Text, View, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { db, firestore, auth } from '../firebaseConfig';
import { getAuth, sendEmailVerification, reload, onAuthStateChanged, signOut } from 'firebase/auth'
import { ref, set, remove, get, onValue } from 'firebase/database'
import { collection, doc, setDoc, getDoc, deleteDoc, onSnapshot } from 'firebase/firestore'

import { v4 as uuidv4 } from 'uuid';

import * as SMS from 'expo-sms';

import * as Location from 'expo-location';

import Contact from '../Contact';
import { styles } from '../styles/styles';

const LoginScreen = (props) => {
  const [displayName, setDisplayName] = useState('');
  
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);

  const [contacts, setContacts] = useState([]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const [cuurentLocation, setCurrentLocation] = useState(null);

  const [message, setMessage] = useState('');

  const user = auth.currentUser;

  useEffect(() => {
    // Wait until user's authentication state is confirmed
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch contacts from Firestore
        const unsubscribeSnapshot = onSnapshot(collection(firestore, 'users', user.uid, 'contacts'), (snapshot) => {
          const contactsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setContacts(contactsData);
        });
  
        // Fetch user's display name from Firestore
        retrieveDataWithFirebase();
        // Cleanup function
        return () => unsubscribeSnapshot();
      }
    });
  
    // Cleanup function
    return () => unsubscribeAuth();
  }, []);

  const retrieveDataWithFirebase = () => {
    const auth = getAuth();
    if (user !== null) {

      var userID = auth.currentUser.uid;
   
      console.log(displayName);
      
      const docRef = doc(firestore, '/users/' + userID);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log(data);
          setDisplayName(data.firstName);
        }
        else {
          console.log('No such document!');
        }
      }).catch((error) => {
        console.log('Error getting document:', error);
      });
    }
  }

  const signoutWithFirebase = () => {
    signOut(auth).then(function () {
      // if logout was successful
      if (!auth.currentUser) {
        Alert.alert('user was logged out!');
        setLoggedIn(false);
        props.navigation.navigate('ScreenOne', { screenTitle: "Logged Out" })
      }
    });
  }

  const handleAddContact = async () => {
    if(newContactName == '' || newContactPhone === '') {
      Alert.alert('Error', 'Please enter a name and phone number for the contact and try again.');
      return;
    }
    try {

      // Generate a unique ID for the contact
      const newContactId = uuidv4();
      
      // Create a DocumentReference for the new contact
      const contactRef = doc(firestore, 'users', auth.currentUser.uid, 'contacts', newContactId);

      // Add new contact to Firestore
     await setDoc(contactRef, {
      name: newContactName,
      phone: newContactPhone,
    });
      // Add new contact to Realtime Database
      const newContactRef = ref(db, 'users/' + auth.currentUser.uid + '/contacts/' + newContactId);
      set(newContactRef, {
        name: newContactName,
        phone: newContactPhone,
      });
  
      // Clear input fields
      setNewContactName('');
      setNewContactPhone('');
    } catch (error) {
      console.error('Error adding contact:', error.message);
      Alert.alert('Error', 'An error occurred while adding the contact. Please try again.');
    }
  };

  const handleRemoveContact = async (contactId) => {
    try {
      // Remove contact from Firestore
      await deleteDoc(doc(firestore, 'users', auth.currentUser.uid, 'contacts', contactId));
      // Remove contact from Realtime Database
      await remove(ref(db, 'users/' + auth.currentUser.uid + '/contacts/' + contactId));
    } catch (error) {
      console.error('Error removing contact:', error.message);
      Alert.alert('Error', 'An error occurred while removing the contact. Please try again.');
    }
  };

  const handleEditContact = (editedContact) => {
    // Implement editing functionality
    //navigate to edit contact screen
    props.navigation.navigate('ScreenFour', { contact: editedContact })

  };

  const messageOnchangeHandler = (text) => { 
    setMessage(text);
  }

  hasLocationPermission = async () => {
    await Location.requestForegroundPermissionsAsync();
    await Location.requestBackgroundPermissionsAsync();

    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('No permission to access location');
      return false;
    }
    else {
      return true;
    }
  
  }

  const sendMessageWithSMS = async () => {
  const isAvailable = await SMS.isAvailableAsync();
  if (isAvailable) {
    if(await hasLocationPermission()) {
    // Get the user's current location
    const location = await Location.getCurrentPositionAsync({});
    const locationString = `My current location is: Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;

    // Append the location to the message
    const messageWithLocation = `${message}\n${locationString}`;
    console.log(message);
    console.log(messageWithLocation);
    // Extract the phone numbers from the contacts list
    const phoneNumbers = contacts.map(contact => contact.phone);

    const { result } = await SMS.sendSMSAsync(
      phoneNumbers,
      messageWithLocation
    );
    console.log(result);
    }
  } else {
    Alert.alert('SMS is not available on this device');
  }
}

  return (
    <View style={styles.form}>
      <Text style={styles.headerLabel}>Welcome {displayName}</Text>
      <Text style={styles.label}>These are your emergency contacts:</Text>
      <FlatList
        contentContainerStyle={styles.contactList}
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Contact contact={item} onEdit={handleEditContact} onRemove={handleRemoveContact} />
        )}
      />
      <View style={styles.newContactContainer}>
      <Text style={styles.newContactLabel} >New Contact:</Text>
        <TextInput
        style={styles.newContactInput}
          placeholder="Name"
          value={newContactName}
          onChangeText={setNewContactName}
        />
        <TextInput
        style={styles.newContactInput}
          placeholder="Phone"
          value={newContactPhone}
          onChangeText={setNewContactPhone}
          keyboardType="phone-pad"
        />
        {/* <Button title="Add Contact" onPress={handleAddContact} /> */}
        <TouchableOpacity style={styles.addButtonContainer} onPress={handleAddContact}>
          <View style={styles.addButton}>
            <Icon name="plus" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.emergencyContainer}>
        <TextInput
        style={styles.emergencyTextInput}
        multiline
        numberOfLines={2}
        placeholder='Your emergency message here'
        onChangeText={messageOnchangeHandler}
        />
        <TouchableOpacity style={styles.emergencyButtonContainer} onPress={sendMessageWithSMS}>
          <View style={styles.emergencyButton}>
            <Icon name="exclamation-circle" size={20} color="#fff" />
              <Text style={styles.emergencyText}> Send Message</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.signOutButtonContainer} >
        <TouchableOpacity style={styles.signOutButton}
          onPress={signoutWithFirebase}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default LoginScreen;