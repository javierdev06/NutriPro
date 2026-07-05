import { Router } from 'express';
import { getObjetivoActivo, postObjetivo } from '../controllers/objetivoController.js';

const router = Router();

router.get('/:usuarioId', getObjetivoActivo);
router.post('/:usuarioId', postObjetivo);

export default router;