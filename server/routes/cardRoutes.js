const express = require('express');
const router = express.Router();
const cardService = require('../services/cardService');

// GET /api/cards - Get all cards with optional filtering and pagination
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/cards - Query params:', req.query);
    
    const filters = {};
    const pagination = {};
    
    // Extract filters from query params
    if (req.query.sport) filters.sport = req.query.sport;
    if (req.query.manufacturer) {
      filters.manufacturer = Array.isArray(req.query.manufacturer) 
        ? req.query.manufacturer 
        : [req.query.manufacturer];
    }
    if (req.query.condition) {
      filters.condition = Array.isArray(req.query.condition) 
        ? req.query.condition 
        : [req.query.condition];
    }
    if (req.query.yearMin && req.query.yearMax) {
      filters.year = { min: parseInt(req.query.yearMin), max: parseInt(req.query.yearMax) };
    }
    if (req.query.priceMin && req.query.priceMax) {
      filters.priceRange = { min: parseFloat(req.query.priceMin), max: parseFloat(req.query.priceMax) };
    }
    if (req.query.rookieOnly === 'true') filters.rookieOnly = true;
    if (req.query.gradedOnly === 'true') filters.gradedOnly = true;
    
    // Extract pagination params
    if (req.query.page) pagination.page = parseInt(req.query.page);
    if (req.query.limit) pagination.limit = parseInt(req.query.limit);
    if (req.query.sortBy) pagination.sortBy = req.query.sortBy;
    if (req.query.sortOrder) pagination.sortOrder = req.query.sortOrder;
    
    const result = await cardService.getAllCards(filters, pagination);
    
    res.json({
      success: true,
      cards: result.cards,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error in GET /api/cards:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/cards/search - Search cards
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    console.log('GET /api/cards/search - Query:', query);
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    const cards = await cardService.searchCards(query);
    
    res.json({
      success: true,
      cards
    });
  } catch (error) {
    console.error('Error in GET /api/cards/search:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/cards/:id - Get single card by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('GET /api/cards/:id - Card ID:', id);
    
    const card = await cardService.getCardById(id);
    
    res.json({
      success: true,
      ...card.toObject()
    });
  } catch (error) {
    console.error('Error in GET /api/cards/:id:', error);
    const statusCode = error.message === 'Card not found' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/cards - Create new card
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/cards - Card data:', req.body);
    
    const card = await cardService.createCard(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Card created successfully',
      card
    });
  } catch (error) {
    console.error('Error in POST /api/cards:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/cards/:id - Update card
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('PUT /api/cards/:id - Card ID:', id, 'Update data:', req.body);
    
    const card = await cardService.updateCard(id, req.body);
    
    res.json({
      success: true,
      message: 'Card updated successfully',
      card
    });
  } catch (error) {
    console.error('Error in PUT /api/cards/:id:', error);
    const statusCode = error.message === 'Card not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/cards/:id - Delete card
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('DELETE /api/cards/:id - Card ID:', id);
    
    const result = await cardService.deleteCard(id);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Error in DELETE /api/cards/:id:', error);
    const statusCode = error.message === 'Card not found' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;