import { Router } from 'express';
import { createCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/categoryController.js';

const router = Router();

// Define as rotas para o recurso "categories"
router.post('/categories', createCategory);
router.get('/categories', getAllCategories);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Garanta que esta é a última linha
export default router;