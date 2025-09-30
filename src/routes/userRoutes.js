import { Router } from 'express';
// Certifique-se que o userController está sendo importado corretamente
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, getPostsByUser } from '../controllers/userController.js';

const router = Router();

router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
// Desafio adicional: Rota para listar posts de um usuário
router.get('/users/:id/posts', getPostsByUser);

// Garanta que esta é a última linha
export default router;