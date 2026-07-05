import { Router } from 'express';
import { getObjetivoActivo, postObjetivo, getVistaPrevia } from '../controllers/objetivoController.js';

const router = Router();

router.get('/:usuarioId/vista-previa', getVistaPrevia);
router.get('/:usuarioId', getObjetivoActivo);
router.post('/:usuarioId', postObjetivo);

export default router;