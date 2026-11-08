import { Router } from 'express';
import * as volcanes from '../controllers/volcanes.controller.js';

const router = Router();

router.get('/', volcanes.listar);
router.get('/:id', volcanes.obtener);
router.post('/', volcanes.crear);
router.put('/:id', volcanes.actualizar);
router.delete('/:id', volcanes.eliminar);

export default router;