import { Router } from 'express';
import { getDia, postItemComida, deleteItemComida } from '../controllers/calendarioController.js';

const router = Router();

router.get('/dia/:usuarioId/:fecha', getDia);
router.post('/comida/:comidaId/items', postItemComida);
router.delete('/items/:itemId', deleteItemComida);

export default router;