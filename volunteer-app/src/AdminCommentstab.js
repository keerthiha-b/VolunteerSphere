import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';

const ActivityListScreen = ({ navigation }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        response = await axios.get(`https://volunteersphere.onrender.com/activities/${organizationId}`);
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderItem = ({ item }) => (
    <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
      <Text>{item.description}</Text>
      <Button
        title="View Comments"
        onPress={() => navigation.navigate('Commentdetail', { opportunityId: item._id })}
      />
    </View>
  );

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item._id.toString()}
      renderItem={renderItem}
    />
  );
};

export default ActivityListScreen;
