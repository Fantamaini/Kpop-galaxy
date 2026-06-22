import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Linking 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { setConcerts, setLoading, setError, setUserLocation } from '../../store/slices/concertsSlice';
import AdminService from '../../services/adminService';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { formatDate } from '../../utils/dateUtils';

export default function ConcertsScreen() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  
  const concerts = useSelector(state => state.concerts.concerts);
  const loading = useSelector(state => state.concerts.loading);
  const userLocation = useSelector(state => state.concerts.userLocation);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConcerts, setFilteredConcerts] = useState([]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = concerts.filter(concert =>
        concert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        concert.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConcerts(filtered);
    } else {
      setFilteredConcerts(concerts);
    }
  }, [searchQuery, concerts]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        dispatch(setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }));
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const loadConcerts = async () => {
    dispatch(setLoading(true));
    const result = await AdminService.getAllConcerts();
    if (result.success) {
      const normalized = result.data.map((item) => {
        const createdAtDate = item.createdAt?.toDate ? item.createdAt.toDate() : null;
        const resolvedDate = item.date || (createdAtDate ? createdAtDate.toISOString() : null);
        return {
          ...item,
          name: item.name || item.title || 'Concert',
          date: resolvedDate ? formatDate(resolvedDate) : '',
          venue: item.venue || item.location || '',
          ticketUrl: item.ticketUrl || item.url || ''
        };
      });
      dispatch(setConcerts(normalized));
    } else {
      dispatch(setError(result.error || 'Erreur lors du chargement des concerts'));
    }
  };

  useEffect(() => {
    loadConcerts();
  }, []);

  const handleBuyTicket = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderConcertCard = ({ item }) => (
    <View style={[styles.concertCard, { backgroundColor: colors.card }]}>
      <View style={styles.concertHeader}>
        <Text style={[styles.concertName, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.concertInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {item.date}{item.time ? ` • ${item.time}` : ''}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {item.venue}{item.city ? `, ${item.city}` : ''}
          </Text>
        </View>

        {item.priceRange && (
          <View style={styles.infoRow}>
            <Ionicons name="pricetag-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              €{item.priceRange.min} - €{item.priceRange.max}
            </Text>
          </View>
        )}
      </View>

      <Button 
        title="Acheter des billets"
        onPress={() => handleBuyTicket(item.ticketUrl)}
        variant="primary"
      />
    </View>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Concerts K-pop
        </Text>
        {userLocation && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            📍 À proximité de vous
          </Text>
        )}
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Rechercher un concert..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredConcerts}
        renderItem={renderConcertCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="musical-notes-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Aucun concert disponible
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.xs
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    height: 50,
    gap: SPACING.sm
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.md
  },
  list: {
    padding: SPACING.lg
  },
  concertCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2
  },
  concertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md
  },
  concertName: {
    flex: 1,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    marginRight: SPACING.sm
  },
  concertInfo: {
    gap: SPACING.sm,
    marginBottom: SPACING.md
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm
  },
  infoText: {
    fontSize: FONTS.sizes.sm,
    flex: 1
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    marginTop: SPACING.md
  }
});
