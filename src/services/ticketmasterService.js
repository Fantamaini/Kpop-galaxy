import axios from 'axios';
import { API_KEYS, API_ENDPOINTS } from '../config/api';

class TicketmasterService {
  constructor() {
    this.apiKey = API_KEYS.TICKETMASTER;
    this.baseUrl = API_ENDPOINTS.TICKETMASTER;
  }

  // Rechercher des concerts
  async searchConcerts(params = {}) {
    try {
      const { keyword, city, countryCode, page = 0, size = 20 } = params;
      
      const response = await axios.get(`${this.baseUrl}/events.json`, {
        params: {
          apikey: this.apiKey,
          keyword: keyword || 'kpop',
          classificationName: 'Music',
          city,
          countryCode,
          page,
          size
        }
      });

      if (response.data._embedded && response.data._embedded.events) {
        return {
          success: true,
          data: response.data._embedded.events.map(event => ({
            id: event.id,
            name: event.name,
            date: event.dates.start.localDate,
            time: event.dates.start.localTime,
            venue: event._embedded.venues[0]?.name,
            city: event._embedded.venues[0]?.city?.name,
            country: event._embedded.venues[0]?.country?.name,
            image: event.images?.[0]?.url,
            url: event.url,
            priceRange: event.priceRanges?.[0]
          }))
        };
      }

      return { success: true, data: [] };
    } catch (error) {
      console.error('Ticketmaster API Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtenir les détails d'un concert
  async getConcertDetails(eventId) {
    try {
      const response = await axios.get(`${this.baseUrl}/events/${eventId}.json`, {
        params: {
          apikey: this.apiKey
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Ticketmaster API Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Rechercher par localisation
  async searchByLocation(latitude, longitude, radius = 50) {
    try {
      const response = await axios.get(`${this.baseUrl}/events.json`, {
        params: {
          apikey: this.apiKey,
          keyword: 'kpop',
          classificationName: 'Music',
          latlong: `${latitude},${longitude}`,
          radius,
          unit: 'km'
        }
      });

      if (response.data._embedded && response.data._embedded.events) {
        return {
          success: true,
          data: response.data._embedded.events
        };
      }

      return { success: true, data: [] };
    } catch (error) {
      console.error('Ticketmaster API Error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new TicketmasterService();
