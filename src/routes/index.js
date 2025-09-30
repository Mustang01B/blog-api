import { Router } from 'express';
import userRoutes from './userRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import postRoutes from './postRoutes.js';

const router = Router();

router.use(userRoutes);
router.use(categoryRoutes);
router.use(postRoutes);

// A linha abaixo é a que corrige o erro.
// Ela exporta todo o objeto 'router' como o item padrão deste arquivo.
export default router;