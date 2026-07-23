import { Router } from 'express';
import { roleRepository } from '../db/index.js';

const router = Router();

// Predefined roles (admin, editor, viewer)
const PREDEFINED_ROLES = ['admin', 'editor', 'viewer'] as const;

// GET /api/roles - Return predefined roles list
router.get('/', (_req, res) => {
  try {
    const roles = roleRepository.findAll().filter(role => 
      PREDEFINED_ROLES.includes(role.name as typeof PREDEFINED_ROLES[number])
    );
    
    const formattedRoles = roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions ? JSON.parse(role.permissions) : null
    }));
    
    res.json({
      data: formattedRoles,
      total: formattedRoles.length
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

export default router;
