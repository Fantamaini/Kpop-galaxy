import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';

// Main Screens
import HomeScreen from '../screens/Home/HomeScreen';
import NewsFeedScreen from '../screens/News/NewsFeedScreen';
import GroupsListScreen from '../screens/Groups/GroupsListScreen';
import GroupDetailsScreen from '../screens/Groups/GroupDetailsScreen';
import ConcertsScreen from '../screens/Concerts/ConcertsScreen';
import MediaLibraryScreen from '../screens/Media/MediaLibraryScreen';
import QuizScreen from '../screens/Quiz/QuizScreen';
import QuizPlayScreen from '../screens/Quiz/QuizPlayScreen';
import AgendaScreen from '../screens/Agenda/AgendaScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import FavoritesScreen from '../screens/Favorites/FavoritesScreen';
import LeaderboardScreen from '../screens/Leaderboard/LeaderboardScreen';
import KChatScreen from '../screens/KChat/KChatScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import ManageNewsScreen from '../screens/Admin/ManageNewsScreen';
import ManageGroupsScreen from '../screens/Admin/ManageGroupsScreen';
import ManageConcertsScreen from '../screens/Admin/ManageConcertsScreen';
import ManageMediaScreen from '../screens/Admin/ManageMediaScreen';
import ManageQuizScreen from '../screens/Admin/ManageQuizScreen';
import ManageEventsScreen from '../screens/Admin/ManageEventsScreen';
import ManageUsersScreen from '../screens/Admin/ManageUsersScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: 6,
          height: 64,
          ...Platform.OS === 'web' ? { boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' } : {},
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'News':
              iconName = focused ? 'newspaper' : 'newspaper-outline';
              break;
            case 'Groups':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Concerts':
              iconName = focused ? 'musical-notes' : 'musical-notes-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen 
        name="News" 
        component={NewsFeedScreen} 
        options={{ tabBarLabel: 'News' }}
      />
      <Tab.Screen 
        name="Groups" 
        component={GroupsListScreen} 
        options={{ tabBarLabel: 'Groupes' }}
      />
      <Tab.Screen 
        name="Concerts" 
        component={ConcertsScreen} 
        options={{ tabBarLabel: 'Concerts' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {/* Auth Screens */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      
      {/* Main App */}
      <Stack.Screen name="MainTabs" component={MainTabs} />
      
      {/* Detail Screens */}
      <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="MediaLibrary" component={MediaLibraryScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="QuizPlay" component={QuizPlayScreen} />
      <Stack.Screen name="Agenda" component={AgendaScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="KChat" component={KChatScreen} />
      
      {/* Admin Screens */}
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="ManageNews" component={ManageNewsScreen} />
      <Stack.Screen name="ManageGroups" component={ManageGroupsScreen} />
      <Stack.Screen name="ManageConcerts" component={ManageConcertsScreen} />
      <Stack.Screen name="ManageMedia" component={ManageMediaScreen} />
      <Stack.Screen name="ManageQuiz" component={ManageQuizScreen} />
      <Stack.Screen name="ManageEvents" component={ManageEventsScreen} />
      <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
    </Stack.Navigator>
  );
}
