import { Router } from 'express';
import * as tours from '../controllers/tours.controller.js';

const router = Router();

router.get('/', tours.listar);
router.get('/resumen', tours.resumen);
router.get('/:id', tours.obtener);
router.post('/', tours.crear);
router.put('/:id', tours.actualizar);
router.patch('/:id/estado', tours.cambiarEstado);
router.delete('/:id', tours.eliminar);

export default router;