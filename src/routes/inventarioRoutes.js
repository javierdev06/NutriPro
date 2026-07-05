import { Router } from 'express';
import {
  getInventario,
  postInventario,
  putAjusteInventario,
  deleteInventario,
  getNecesidadesSemana
} from '../controllers/inventarioController.js';

const router = Router();

router.get('/:usuarioId/necesidades', getNecesidadesSemana);
router.get('/:usuarioId', getInventario);
router.post('/:usuarioId', postInventario);
router.put('/:usuarioId/:alimentoId', putAjusteInventario);
router.delete('/:usuarioId/:alimentoId', deleteInventario);

export default router;