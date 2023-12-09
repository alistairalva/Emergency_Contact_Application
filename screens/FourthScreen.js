// EditContactScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';

import { doc, setDoc } from 'firebase/firestore';
import { ref, update } from 'firebase/database';
import { db, firestore, auth } from '../firebaseConfig'; // Import your Firestore instance
import { styles } from '../styles/styles';

const EditContactScreen = ({ route, navigation }) => {
  const { contact } = route.params;
  const [editedContactName, setEditedContactName] = useState(contact.name);
  const [editedContactPhone, setEditedContactPhone] = useState(contact.phone);

  const handleSaveChanges = async () => {
    try {
      // Update the contact in Firestore
        await setDoc(doc(firestore, 'users', auth.currentUser.uid, 'contacts', contact.id), {
            name: editedContactName,
            phone: editedContactPhone,
        }, { merge: true });

      // Update the contact in Realtime Database
        const contactRef = ref(db, 'users/' + auth.currentUser.uid + '/contacts/' + contact.id);
        await update(contactRef, {
            name: editedContactName,
            phone: editedContactPhone,
        });
  
      // Show a success message
      Alert.alert('Contact Updated', 'Changes have been saved successfully.');
  
      // Navigate back to the previous screen
      navigation.goBack();
    } catch (error) {
      console.error('Error updating contact:', error.message);
      Alert.alert('Error', 'An error occurred while updating the contact. Please try again.');
    }
  };

  return (
    <View style={styles.form}>
        <View style={styles.editContactContainer}>
            <Text style={styles.headerLabel}>Edit Contact:</Text>
            <TextInput
                style={styles.newContactInput}
                placeholder="Name"
                value={editedContactName}
                onChangeText={setEditedContactName}
            />
            <TextInput
                style={styles.newContactInput}
                placeholder="Phone"
                value={editedContactPhone}
                onChangeText={setEditedContactPhone}
                keyboardType="phone-pad"
            />
        </View>
      {/* <Button title="Save Changes" onPress={handleSaveChanges} /> */}
        <Pressable style={styles.button}onPress={handleSaveChanges}>
            <Text style={styles.text}>Save Changes</Text>
        </Pressable>
    </View>
  );
};

export default EditContactScreen;