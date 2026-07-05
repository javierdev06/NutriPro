import { Router } from 'express';
import { getRecordatorios, putRecordatorio } from '../controllers/recordatorioController.js';

const router = Router();

router.get('/:usuarioId', getRecordatorios);
router.put('/:usuarioId', putRecordatorio);

export default router;