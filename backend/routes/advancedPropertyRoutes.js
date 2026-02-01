import express from 'express';
import Property from '../models/propertymodel.js';
import { protect, authorize } from '../middleware/authmiddleware.js';

const router = express.Router();

/**
 * ===================================
 * AGGREGATION-BASED ENDPOINTS
 * ===================================
 */

/**
 * GET /api/analytics/price-by-location
 * Get property price analytics grouped by type/location
 * Aggregation Pipeline: $match -> $group -> $project -> $sort
 */
router.get('/analytics/price-by-location', async (req, res) => {
  try {
    const { city, groupBy = 'type' } = req.query;

    const matchStage = city ? { $match: { city } } : { $match: {} };

    const analytics = await Property.aggregate([
      matchStage,
      {
        $group: {
          _id: `$${groupBy}`,
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgSqft: { $avg: '$sqft' },
          avgRating: { $avg: '$rating' },
          totalViews: { $sum: '$viewCount' }
        }
      },
      {
        $project: {
          [groupBy]: '$_id',
          count: 1,
          averagePrice: { $round: ['$averagePrice', 2] },
          minPrice: 1,
          maxPrice: 1,
          priceRange: { $subtract: ['$maxPrice', '$minPrice'] },
          pricePerSqft: {
            $round: [{ $divide: ['$averagePrice', { $divide: ['$avgSqft', 1] }] }, 2]
          },
          avgRating: { $round: ['$avgRating', 2] },
          totalViews: 1,
          _id: 0
        }
      },
      { $sort: { averagePrice: -1 } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Price analytics retrieved successfully',
      data: analytics
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics',
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/top-performing
 * Get top performing properties by views, ratings, and appointments
 * Aggregation Pipeline: $addFields -> $sort -> $limit -> $lookup
 */
router.get('/analytics/top-performing', async (req, res) => {
  try {
    const { limit = 10, city } = req.query;

    const matchStage = city ? { $match: { city } } : { $match: {} };

    const topProperties = await Property.aggregate([
      matchStage,
      {
        $addFields: {
          performanceScore: {
            $add: [
              { $multiply: ['$rating', 20] },
              { $multiply: ['$viewCount', 0.5] },
              { $multiply: ['$appointmentCount', 10] }
            ]
          },
          reviewCount: { $cond: [{ $isArray: '$reviews' }, { $size: '$reviews' }, 0] }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'ownerInfo'
        }
      },
      { $unwind: { path: '$ownerInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          title: 1,
          price: 1,
          city: 1,
          type: 1,
          rating: 1,
          viewCount: 1,
          appointmentCount: 1,
          reviewCount: 1,
          performanceScore: { $round: ['$performanceScore', 2] },
          ownerName: '$ownerInfo.name',
          createdAt: 1
        }
      },
      { $sort: { performanceScore: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.status(200).json({
      success: true,
      message: 'Top performing properties retrieved',
      count: topProperties.length,
      data: topProperties
    });
  } catch (error) {
    console.error('Top properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve top properties',
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/market-trends
 * Get market trends including property distribution, average prices by month
 * Aggregation Pipeline: $group -> $project -> $sort
 */
router.get('/analytics/market-trends', async (req, res) => {
  try {
    const trends = await Property.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            type: '$type'
          },
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          availableCount: {
            $sum: { $cond: [{ $eq: ['$availability', 'available'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          date: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              { $toString: '$_id.month' }
            ]
          },
          type: '$_id.type',
          count: 1,
          averagePrice: { $round: ['$averagePrice', 2] },
          availableCount: 1,
          _id: 0
        }
      },
      { $sort: { date: -1 } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Market trends retrieved successfully',
      data: trends
    });
  } catch (error) {
    console.error('Market trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve market trends',
      error: error.message
    });
  }
});

/**
 * ===================================
 * ADVANCED SEARCH & FILTER ENDPOINTS
 * ===================================
 */

/**
 * GET /api/properties/search
 * Full-text search with pagination and filtering
 * Uses text index for efficient searching
 */
router.get('/properties/search', async (req, res) => {
  try {
    const { query, city, minPrice, maxPrice, type, beds, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const filter = {};

    if (query) {
      filter.$text = { $search: query };
    }
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (type) filter.type = type;
    if (beds) filter.beds = { $gte: parseInt(beds) };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = {};

    // Parse sort parameter
    if (sort.startsWith('-')) {
      sortObj[sort.substring(1)] = -1;
    } else {
      sortObj[sort] = 1;
    }

    // If text search is used, include score
    const selectFields = query ? { score: { $meta: 'textScore' } } : {};

    const properties = await Property.find(filter, selectFields)
      .sort(query ? { score: { $meta: 'textScore' } } : sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('owner', 'name email phone')
      .lean();

    const total = await Property.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: properties,
      pagination: {
        current: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
});

/**
 * GET /api/properties/by-location/:city
 * Get all properties in a specific city with aggregated statistics
 */
router.get('/properties/by-location/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const properties = await Property.find({ city })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    const stats = await Property.aggregate([
      { $match: { city } },
      {
        $group: {
          _id: null,
          totalProperties: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: `Properties in ${city} retrieved successfully`,
      data: properties,
      statistics: stats[0] || {},
      pagination: {
        current: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve properties by location',
      error: error.message
    });
  }
});

/**
 * ===================================
 * ADVANCED UPDATE OPERATIONS
 * ===================================
 */

/**
 * PUT /api/properties/:id/add-amenity
 * Add amenity to property using $push operator
 */
router.put('/properties/:id/add-amenity', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { amenity } = req.body;

    if (!amenity) {
      return res.status(400).json({
        success: false,
        message: 'Amenity is required'
      });
    }

    const property = await Property.findByIdAndUpdate(
      id,
      { $push: { amenities: amenity } },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Amenity added successfully',
      data: property
    });
  } catch (error) {
    console.error('Add amenity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add amenity',
      error: error.message
    });
  }
});

/**
 * PUT /api/properties/:id/remove-amenity
 * Remove amenity from property using $pull operator
 */
router.put('/properties/:id/remove-amenity', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { amenity } = req.body;

    if (!amenity) {
      return res.status(400).json({
        success: false,
        message: 'Amenity is required'
      });
    }

    const property = await Property.findByIdAndUpdate(
      id,
      { $pull: { amenities: amenity } },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Amenity removed successfully',
      data: property
    });
  } catch (error) {
    console.error('Remove amenity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove amenity',
      error: error.message
    });
  }
});

/**
 * PUT /api/properties/:id/increment-views
 * Increment view count using $inc operator
 */
router.put('/properties/:id/increment-views', async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByIdAndUpdate(
      id,
      {
        $inc: { viewCount: 1 },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'View count incremented',
      data: { viewCount: property.viewCount }
    });
  } catch (error) {
    console.error('Increment views error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to increment views',
      error: error.message
    });
  }
});

/**
 * PUT /api/properties/:id/add-review
 * Add review to property using $push operator
 */
router.put('/properties/:id/add-review', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const review = {
      userId,
      rating,
      comment: comment || '',
      createdAt: new Date()
    };

    const property = await Property.findByIdAndUpdate(
      id,
      {
        $push: { reviews: review },
        $inc: { appointmentCount: 1 } // Increment review count
      },
      { new: true }
    ).populate('reviews.userId', 'name');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: property
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
});

/**
 * PUT /api/properties/bulk-update-status
 * Update status for multiple properties using updateMany
 */
router.put('/properties/bulk-update-status', protect, authorize('admin'), async (req, res) => {
  try {
    const { propertyIds, newStatus } = req.body;

    if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'propertyIds must be a non-empty array'
      });
    }

    const validStatuses = ['available', 'sold', 'rented', 'pending'];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const result = await Property.updateMany(
      { _id: { $in: propertyIds } },
      {
        $set: {
          availability: newStatus,
          updatedAt: new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Properties updated successfully',
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update properties',
      error: error.message
    });
  }
});

export default router;
