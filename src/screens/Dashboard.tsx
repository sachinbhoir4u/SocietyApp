import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { COLORS, SIZES } from '../utils/constants';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
};

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

interface User {
  email: string;
  flatNumber: string;
}

interface ActionCardProps {
  title: string;
  icon: string;
  onPress: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <FontAwesome name={icon} size={30} color={COLORS.primary} />
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function Dashboard({ navigation }: Props) {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    setUser(null);
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user?.email || 'User'}!</Text>
        <Text style={styles.subtitle}>Flat: {user?.flatNumber || 'N/A'}</Text>
      </View>
      <View style={styles.cardContainer}>
        <ActionCard
          title="Payments"
          icon="money"
          onPress={() => alert('Payments screen coming soon!')}
        />
        <ActionCard
          title="Notices"
          icon="bell"
          onPress={() => alert('Notices screen coming soon!')}
        />
        <ActionCard
          title="Complaints"
          icon="exclamation-circle"
          onPress={() => alert('Complaints screen coming soon!')}
        />
        <ActionCard
          title="Visitors"
          icon="users"
          onPress={() => alert('Visitor Management screen coming soon!')}
        />
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <FontAwesome name="sign-out" size={20} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  header: {
    padding: SIZES.padding,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: SIZES.margin,
    color: COLORS.text,
  },
  title: {
    fontSize: SIZES.title_md,
    fontWeight: 'bold',
    // color: '#fff',
    marginBottom: SIZES.margin / 2,
  },
  subtitle: {
    fontSize: SIZES.subtitle,
    // color: '#fff',
    opacity: 0.8,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: SIZES.text,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SIZES.margin,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#f44336',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
    margin: SIZES.padding,
  },
  buttonText: {
    color: 'white',
    fontSize: SIZES.text,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 10,
  },
});