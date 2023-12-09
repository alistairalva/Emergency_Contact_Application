// Contact.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { styles }  from './styles/styles';

const Contact = ({ contact, onEdit, onRemove }) => {
  
  return (
    <View style={styles.contactContainer}>
      <View style={styles.contactTextContainer}>
        <Text style={styles.contactText}>{contact.name}</Text>
        <Text style={styles.contactText}>{contact.phone}</Text>
      </View>
      <View style={styles.contactIconContainer}> 
      <TouchableOpacity onPress={() => onEdit(contact)}>
        <Icon style={styles.contactIcon} name="pencil" size={18} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onRemove(contact.id)}>
        <Icon style={styles.contactIcon} name="trash" size={18} color="black" />
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default Contact;
