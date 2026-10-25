import { Router } from 'express';
import { searchFacilities } from '../services/hospitalService.js';
import { hospitalSearchSchema } from '../utils/schemas.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const validation = hospitalSearchSchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.errors[0]?.message || 'Invalid search parameters.'
      });
    }

    const { query, filter, lat, lng } = validation.data;
    const data = await searchFacilities({ query, filter, lat, lng });

    return res.json({
      success: true,
      facilities: data.facilities,
      total: data.total,
      attribution: data.attribution,
      notice: 'Listings, phone numbers and hours may be outdated. Call first, and call 112 in an emergency.'
    });

  } catch (error) {
    console.error('[Hospitals Error]', error.message);
    return res.status(500).json({
      success: false,
      error: 'Unable to retrieve healthcare facilities at this time.'
    });
  }
});

export default router;
