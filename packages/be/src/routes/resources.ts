import { Router } from 'express';
import { resourceRepository } from '../db/index.js';

const router = Router();

// GET /api/resources - List sample resources with optional type filter
router.get('/', (req, res) => {
  try {
    const { type } = req.query;
    
    let resources;
    if (type && typeof type === 'string') {
      resources = resourceRepository.findByType(type);
    } else {
      resources = resourceRepository.findAll();
    }
    
    const formattedResources = resources.map(resource => ({
      id: resource.id,
      type: resource.type,
      identifier: resource.identifier,
      name: resource.name,
      attributes: resource.attributes ? JSON.parse(resource.attributes) : null,
      created_at: resource.created_at,
      updated_at: resource.updated_at
    }));
    
    res.json({
      data: formattedResources,
      total: formattedResources.length,
      filter: type ? { type } : null
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// GET /api/resources/:id - Get single resource by ID
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid resource ID' });
    }
    
    const resource = resourceRepository.findById(id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    res.json({
      data: {
        id: resource.id,
        type: resource.type,
        identifier: resource.identifier,
        name: resource.name,
        attributes: resource.attributes ? JSON.parse(resource.attributes) : null,
        created_at: resource.created_at,
        updated_at: resource.updated_at
      }
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
});

export default router;
