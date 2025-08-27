import api from './api';

// Description: Get all cards from database
// Endpoint: GET /api/cards
// Request: {}
// Response: { cards: Array<any> }
export const getCards = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        cards: [
          {
            _id: '1',
            playerName: 'Mike Trout',
            team: 'Los Angeles Angels',
            year: 2021,
            sport: 'Baseball',
            manufacturer: 'Topps',
            set: 'Series 1',
            cardNumber: '1',
            condition: 'Near Mint',
            estimatedValue: 450,
            isRookie: false,
            isGraded: true,
            frontImage: null,
            backImage: null,
            dateAdded: new Date().toISOString()
          },
          {
            _id: '2',
            playerName: 'Ronald Acuña Jr.',
            team: 'Atlanta Braves',
            year: 2018,
            sport: 'Baseball',
            manufacturer: 'Bowman',
            set: 'Chrome',
            cardNumber: '31',
            condition: 'Mint',
            estimatedValue: 1200,
            isRookie: true,
            isGraded: false,
            frontImage: null,
            backImage: null,
            dateAdded: new Date().toISOString()
          },
          {
            _id: '3',
            playerName: 'Luka Dončić',
            team: 'Dallas Mavericks',
            year: 2018,
            sport: 'Basketball',
            manufacturer: 'Panini',
            set: 'Prizm',
            cardNumber: '280',
            condition: 'Near Mint',
            estimatedValue: 850,
            isRookie: true,
            isGraded: true,
            frontImage: null,
            backImage: null,
            dateAdded: new Date().toISOString()
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/cards');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}

// Description: Search cards by query
// Endpoint: GET /api/cards/search
// Request: { query: string }
// Response: { cards: Array<any> }
export const searchCards = (data: { query: string }) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        cards: [
          {
            _id: '1',
            playerName: 'Mike Trout',
            team: 'Los Angeles Angels',
            year: 2021,
            sport: 'Baseball',
            manufacturer: 'Topps',
            set: 'Series 1',
            cardNumber: '1',
            condition: 'Near Mint',
            estimatedValue: 450,
            isRookie: false,
            isGraded: true,
            frontImage: null,
            backImage: null,
            dateAdded: new Date().toISOString()
          }
        ]
      });
    }, 300);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/cards/search', { params: data });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}

// Description: Get single card by ID
// Endpoint: GET /api/cards/:id
// Request: {}
// Response: Card object with detailed information
export const getCard = (id: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        _id: id,
        playerName: 'Mike Trout',
        team: 'Los Angeles Angels',
        year: 2021,
        sport: 'Baseball',
        manufacturer: 'Topps',
        set: 'Series 1',
        cardNumber: '1',
        serialNumber: 'MT001',
        condition: 'Near Mint',
        conditionScore: 85,
        centeringScore: 90,
        cornersScore: 80,
        edgesScore: 85,
        surfaceScore: 88,
        estimatedValue: 450,
        priceChange: 12,
        isRookie: false,
        isGraded: true,
        isParallel: false,
        frontImage: null,
        backImage: null,
        dateAdded: new Date().toISOString(),
        lastPriceUpdate: new Date().toISOString(),
        notes: 'Excellent centering, minor corner wear on bottom right.',
        conditionNotes: [
          {
            issue: 'Minor corner wear',
            description: 'Slight wear on bottom right corner',
            severity: 'minor'
          },
          {
            issue: 'Surface quality',
            description: 'Clean surface with no scratches',
            severity: 'minor'
          }
        ],
        recentSales: [
          {
            price: 475,
            condition: 'Near Mint',
            platform: 'eBay',
            date: new Date(Date.now() - 86400000).toISOString(),
            type: 'Auction'
          },
          {
            price: 425,
            condition: 'Near Mint',
            platform: 'eBay',
            date: new Date(Date.now() - 172800000).toISOString(),
            type: 'Buy It Now'
          }
        ],
        tcgPlayerPrice: 440,
        ebayAverage: 450
      });
    }, 400);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get(`/api/cards/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}

// Description: Delete a card
// Endpoint: DELETE /api/cards/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteCard = (id: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Card deleted successfully'
      });
    }, 300);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.delete(`/api/cards/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}