import { Router } from 'express';
import { getRecetas, getRecetaPorId, postReceta, deleteReceta } from '../controllers/recetaController.js';

const router = Router();

router.get('/', getRecetas);
router.get('/:id', getRecetaPorId);
router.post('/', postReceta);
router.delete('/:id', deleteReceta);

export default router;