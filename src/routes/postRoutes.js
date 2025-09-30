import { Router } from 'express';
import { createPost, getAllPosts, getPostById, updatePost, deletePost } from '../controllers/postController.js';

const router = Router();

// Define as rotas para o recurso "posts"
router.post('/posts', createPost);
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

// Garanta que esta é a última linha
export default router;