import { Router } from 'express';
import { getAgua, postAgua, putMetaAgua } from '../controllers/aguaController.js';

const router = Router();

router.get('/:usuarioId/:fecha', getAgua);
router.post('/:usuarioId/:fecha', postAgua);
router.put('/:usuarioId/:fecha/meta', putMetaAgua);

export default router;