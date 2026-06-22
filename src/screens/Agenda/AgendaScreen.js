import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import AdminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { formatDate } from '../../utils/dateUtils';

export default function AgendaScreen({ navigation }) {
  const { colors } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const result = await AdminService.getAllEvents();
      if (result.success) {
        const normalized = result.data.map((item) => {
          const createdAtDate = item.createdAt?.toDate ? item.createdAt.toDate() : null;
          const resolvedDate = item.date || (createdAtDate ? createdAtDate.toISOString() : null);

          return {
            ...item,
            type: item.type || 'Autre',
            date: resolvedDate ? formatDate(resolvedDate) : ''
          };
        });
        setEvents(normalized);
      }
      setLoading(false);
    };

    loadEvents();
  }, []);

  const getEventIcon = (type) => {
    const normalized = type?.toLowerCase?.() || '';
    switch (normalized) {
      case 'comeback':
        return 'musical-notes';
      case 'birthday':
        return 'gift';
      case 'concert':
      case 'fan meeting':
      case 'showcase':
      case 'festival':
        return 'mic';
      case 'award':
        return 'trophy';
      default:
        return 'calendar';
    }
  };

  const getEventColor = (type) => {
    const normalized = type?.toLowerCase?.() || '';
    switch (normalized) {
      case 'comeback':
        return colors.primary;
      case 'birthday':
        return colors.secondary;
      case 'concert':
      case 'fan meeting':
      case 'showcase':
      case 'festival':
        return colors.accent;
      case 'award':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Agenda K-pop
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('ManageEvents')}>
          <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Aucun événement disponible
            </Text>
          </View>
        ) : (
          events.map((event, index) => {
          const eventColor = getEventColor(event.type);
          const eventIcon = getEventIcon(event.type);
          
          return (
            <View key={event.id} style={styles.timelineItem}>
              {/* Timeline Line */}
              {index !== events.length - 1 && (
                <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
              )}

              {/* Timeline Dot */}
              <View style={[styles.timelineDot, { backgroundColor: eventColor }]}>
                <Ionicons name={eventIcon} size={16} color="#FFFFFF" />
              </View>

              {/* Event Card */}
              <View style={[styles.eventCard, { backgroundColor: colors.card }]}>
                <View style={styles.eventHeader}>
                  <Text style={[styles.eventDate, { color: eventColor }]}>
                    {event.date}{event.time ? ` • ${event.time}` : ''}
                  </Text>
                  <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.eventTitle, { color: colors.text }]}>
                  {event.title}
                </Text>

                <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>
                  {event.description}
                </Text>
                {event.location ? (
                  <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>
                    {event.location}
                  </Text>
                ) : null}
              </View>
            </View>
          );
        })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.xl
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold'
  },
  content: {
    padding: SPACING.lg
  },
  timelineItem: {
    position: 'relative',
    paddingLeft: 40,
    marginBottom: SPACING.lg
  },
  timelineLine: {
    position: 'absolute',
    left: 15,
    top: 40,
    width: 2,
    height: '100%'
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
  },
  eventCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    elevation: 2
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs
  },
  eventDate: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600'
  },
  eventTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    marginBottom: SPACING.xs
  },
  eventDescription: {
    fontSize: FONTS.sizes.sm
  },
  eventLocation: {
    fontSize: FONTS.sizes.xs,
    marginTop: SPACING.xs
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
