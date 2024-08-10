import React, { useEffect, useState } from 'react';
import { View, Alert, Button, Text, StyleSheet, FlatList } from 'react-native';
import { save, getValueFor } from './utils/secureStoreUtil'; 
import axios from 'axios';
import Posting from './StudentAvailablePosting'; 


const temp = ({navigation}) => {
    const [opportunities, setOpportunities] = useState([]);
    useEffect(() => {
        const getNearbyOpportunities = async () => {
            try {
                const userType = await getValueFor('userType');
                const organizationId = await getValueFor('userId'); // Assuming 'userId' is saved during login/signup
                
                let response;
                response = await axios.get('https://volunteersphere.onrender.com/activities');
                
                setOpportunities(response.data);
            } catch (error) {
            console.error('Error fetching activities:', error);
          }
        }
        getNearbyOpportunities();
        console.log(opportunities);
    }, []);

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Volunteer Opportunities</Text>
            <FlatList
                data={opportunities}
                keyExtractor={item => item._id.toString()} 
                renderItem={({ item }) => <Posting opportunity={item} navigation={navigation} />}
            />
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 10,
      paddingLeft: 20,
      paddingRight: 20,
      backgroundColor: '#ffff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    }
})
export default temp;
