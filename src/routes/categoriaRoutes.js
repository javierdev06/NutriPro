import { Router } from 'express';
import { getCategorias, postCategoria } from '../controllers/categoriaController.js';

const router = Router();

router.get('/', getCategorias);
router.post('/', postCategoria);

export default router;