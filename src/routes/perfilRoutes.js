import { Router } from 'express';
import { getPerfil, putPerfil } from '../controllers/perfilController.js';

const router = Router();

router.get('/:usuarioId', getPerfil);
router.put('/:usuarioId', putPerfil);

export default router;