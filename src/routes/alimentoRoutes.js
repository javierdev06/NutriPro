import { Router } from 'express';
import { getAlimentos, getAlimentoPorId, postAlimento } from '../controllers/alimentoController.js';

const router = Router();

router.get('/', getAlimentos);
router.get('/:id', getAlimentoPorId);
router.post('/', postAlimento);

export default router;