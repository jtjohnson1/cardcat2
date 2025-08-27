import api from './api';

// Description: Get all cards from database
// Endpoint: GET /api/cards
// Request: { filters?: object, pagination?: object }
// Response: { success: boolean, cards: Array<any>, pagination?: object }
export const getCards = async (filters = {}, pagination = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add filters to params
    if (filters.sport) params.append('sport', filters.sport);
    if (filters.manufacturer) {
      filters.manufacturer.forEach(m => params.append('manufacturer', m));
    }
    if (filters.condition) {
      filters.condition.forEach(c => params.append('condition', c));
    }
    if (filters.year) {
      params.append('yearMin', filters.year.min.toString());
      params.append('yearMax', filters.year.max.toString());
    }
    if (filters.priceRange) {
      params.append('priceMin', filters.priceRange.min.toString());
      params.append('priceMax', filters.priceRange.max.toString());
    }
    if (filters.rookieOnly) params.append('rookieOnly', 'true');
    if (filters.gradedOnly) params.append('gradedOnly', 'true');
    
    // Add pagination to params
    if (pagination.page) params.append('page', pagination.page.toString());
    if (pagination.limit) params.append('limit', pagination.limit.toString());
    if (pagination.sortBy) params.append('sortBy', pagination.sortBy);
    if (pagination.sortOrder) params.append('sortOrder', pagination.sortOrder);
    
    const response = await api.get(`/api/cards?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Search cards by query
// Endpoint: GET /api/cards/search
// Request: { query: string }
// Response: { success: boolean, cards: Array<any> }
export const searchCards = async (data: { query: string }) => {
  try {
    const response = await api.get('/api/cards/search', { params: data });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Get single card by ID
// Endpoint: GET /api/cards/:id
// Request: {}
// Response: Card object with detailed information
export const getCard = async (id: string) => {
  try {
    const response = await api.get(`/api/cards/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Create a new card
// Endpoint: POST /api/cards
// Request: { card data object }
// Response: { success: boolean, message: string, card: object }
export const createCard = async (cardData: any) => {
  try {
    const response = await api.post('/api/cards', cardData);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Update a card
// Endpoint: PUT /api/cards/:id
// Request: { card data object }
// Response: { success: boolean, message: string, card: object }
export const updateCard = async (id: string, cardData: any) => {
  try {
    const response = await api.put(`/api/cards/${id}`, cardData);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Delete a card
// Endpoint: DELETE /api/cards/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteCard = async (id: string) => {
  try {
    const response = await api.delete(`/api/cards/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}