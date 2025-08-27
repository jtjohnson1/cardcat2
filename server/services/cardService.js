const Card = require('../models/Card');

class CardService {
  async getAllCards(filters = {}, pagination = {}) {
    try {
      console.log('CardService: Getting all cards with filters:', filters);
      
      const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
      const skip = (page - 1) * limit;
      
      // Build query object
      let query = {};
      
      // Apply filters
      if (filters.sport) {
        query.sport = filters.sport;
      }
      
      if (filters.manufacturer && filters.manufacturer.length > 0) {
        query.manufacturer = { $in: filters.manufacturer };
      }
      
      if (filters.condition && filters.condition.length > 0) {
        query.condition = { $in: filters.condition };
      }
      
      if (filters.year) {
        query.year = { $gte: filters.year.min, $lte: filters.year.max };
      }
      
      if (filters.priceRange) {
        query.estimatedValue = { $gte: filters.priceRange.min, $lte: filters.priceRange.max };
      }
      
      if (filters.rookieOnly) {
        query.isRookie = true;
      }
      
      if (filters.gradedOnly) {
        query.isGraded = true;
      }
      
      // Build sort object
      const sortObj = {};
      sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
      
      const cards = await Card.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit));
      
      const total = await Card.countDocuments(query);
      
      console.log(`CardService: Found ${cards.length} cards out of ${total} total`);
      
      return {
        cards,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('CardService: Error getting cards:', error);
      throw error;
    }
  }

  async searchCards(query) {
    try {
      console.log('CardService: Searching cards with query:', query);
      
      const searchRegex = new RegExp(query, 'i');
      const cards = await Card.find({
        $or: [
          { playerName: searchRegex },
          { team: searchRegex },
          { set: searchRegex },
          { manufacturer: searchRegex }
        ]
      }).limit(50);
      
      console.log(`CardService: Found ${cards.length} cards matching search`);
      return cards;
    } catch (error) {
      console.error('CardService: Error searching cards:', error);
      throw error;
    }
  }

  async getCardById(id) {
    try {
      console.log('CardService: Getting card by ID:', id);
      
      const card = await Card.findById(id);
      if (!card) {
        throw new Error('Card not found');
      }
      
      console.log('CardService: Found card:', card.playerName);
      return card;
    } catch (error) {
      console.error('CardService: Error getting card by ID:', error);
      throw error;
    }
  }

  async createCard(cardData) {
    try {
      console.log('CardService: Creating new card:', cardData.playerName);
      
      const card = new Card(cardData);
      await card.save();
      
      console.log('CardService: Card created successfully with ID:', card._id);
      return card;
    } catch (error) {
      console.error('CardService: Error creating card:', error);
      throw error;
    }
  }

  async updateCard(id, updateData) {
    try {
      console.log('CardService: Updating card:', id);
      
      const card = await Card.findByIdAndUpdate(
        id,
        { ...updateData, lastPriceUpdate: new Date() },
        { new: true, runValidators: true }
      );
      
      if (!card) {
        throw new Error('Card not found');
      }
      
      console.log('CardService: Card updated successfully');
      return card;
    } catch (error) {
      console.error('CardService: Error updating card:', error);
      throw error;
    }
  }

  async deleteCard(id) {
    try {
      console.log('CardService: Deleting card:', id);
      
      const card = await Card.findByIdAndDelete(id);
      if (!card) {
        throw new Error('Card not found');
      }
      
      console.log('CardService: Card deleted successfully');
      return { success: true, message: 'Card deleted successfully' };
    } catch (error) {
      console.error('CardService: Error deleting card:', error);
      throw error;
    }
  }
}

module.exports = new CardService();