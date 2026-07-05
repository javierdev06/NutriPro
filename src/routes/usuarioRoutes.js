import { Router } from 'express';
import { postUsuario, getUsuario } from '../controllers/usuarioController.js';

const router = Router();

router.post('/', postUsuario);
router.get('/', getUsuario);

export default router;