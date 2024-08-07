import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { save, getValueFor } from './utils/secureStoreUtil';

const ProfilePage = ({ navigation }) => {
  const name = getValueFor("name");
  const email = getValueFor("email");
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('OrgLandingPage')}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon}>
          <FontAwesome name="edit" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.contactInfo}>{email}|555-555-5555</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account and System</Text>
        <View style={styles.sectionItem}>
          <MaterialIcons name="verified-user" size={24} color="#6d4c41" />
          <Text style={styles.sectionItemText}>Account Information and Verification</Text>
        </View>
        <View style={styles.sectionItem}>
          <MaterialIcons name="notifications" size={24} color="#6d4c41" />
          <Text style={styles.sectionItemText}>Notifications</Text>
        </View>
        <View style={styles.sectionItem}>
          <MaterialIcons name="language" size={24} color="#6d4c41" />
          <Text style={styles.sectionItemText}>Language</Text>
          <Text style={styles.sectionItemSubText}>English</Text>
        </View>
        <View style={styles.sectionItem}>
          <MaterialIcons name="accessibility" size={24} color="#6d4c41" />
          <Text style={styles.sectionItemText}>Accessibility</Text>
        </View>
        <View style={styles.sectionItem}>
          <MaterialIcons name="security" size={24} color="#6d4c41" />
          <Text style={styles.sectionItemText}>Device Permissions</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Info and Support</Text>
        <View style={styles.sectionItem}>
          <MaterialIcons name="help-outline" size={24} color="#6d4c41" />
          <Text style={styles.sectionItemText}>Help and Support</Text>
        </View>
        <View style={styles.sectionItem}>
          <MaterialIcons name="contact-support" size={24} color="#6d4c41" />
          <Text style={styles.sectionItemText}>Contact Us</Text>
        </View>
        <View style={styles.sectionItem}>
          <MaterialIcons name="lock-outline" size={24} color="#6d4c41" />
          <Text style={styles.sectionItemText}>Privacy Policy</Text>
        </View>
        <View style={styles.sectionItem}>
          <MaterialIcons name="info-outline" size={24} color="#6d4c41" />
          <Text style={styles.sectionItemText}>About</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#6d4c41',
    padding: 15,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    top: 80,
    right: 140,
    backgroundColor: '#6d4c41',
    borderRadius: 20,
    padding: 5,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  contactInfo: {
    fontSize: 14,
    color: '#777',
  },
  section: {
    marginVertical: 20,
    marginHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  sectionItemText: {
    fontSize: 16,
    marginLeft: 10,
  },
  sectionItemSubText: {
    marginLeft: 'auto',
    color: '#777',
  },
});

export default ProfilePage;
