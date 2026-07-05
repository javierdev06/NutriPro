import { Router } from 'express';
import { getHistorialPeso, postRegistroPeso, deleteRegistroPeso } from '../controllers/pesoController.js';

const router = Router();

router.get('/:usuarioId', getHistorialPeso);
router.post('/:usuarioId', postRegistroPeso);
router.delete('/:id', deleteRegistroPeso);

export default router;