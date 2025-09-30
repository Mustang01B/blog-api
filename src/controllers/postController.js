import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Criar uma nova postagem
export const createPost = async (req, res) => {
  try {
    // Pegamos os IDs do usuário e da categoria junto com o conteúdo do post
    const { title, content, userId, categoryId } = req.body;

    if (!title || !content || !userId || !categoryId) {
      return res.status(400).json({ error: 'Todos os campos (title, content, userId, categoryId) são obrigatórios.' });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        userId: parseInt(userId),
        categoryId: parseInt(categoryId),
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    // Erro P2003 indica que o userId ou categoryId não existe
    if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Usuário ou Categoria não encontrado.' });
    }
    res.status(500).json({ error: 'Não foi possível criar a postagem.' });
  }
};

// Listar todas as postagens
// VERSÃO NOVA COM PAGINAÇÃO - USE ESTA
export const getAllPosts = async (req, res) => {
  try {
    // 1. Pega 'page' e 'pageSize' da URL. Se não vierem, usa valores padrão.
    // req.query é como acessamos os parâmetros depois do "?" na URL
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // 2. Calcula quantos registros precisam ser "pulados".
    // Para a página 1, pula 0. Para a página 2, pula `pageSize` registros.
    const skip = (page - 1) * pageSize;

    // 3. Pede ao Prisma os posts, mas agora com limites (skip e take)
    const posts = await prisma.post.findMany({
      skip: skip,   // Pula os registros das páginas anteriores
      take: pageSize, // Pega apenas a quantidade de registros para uma página
      orderBy: {
        createdAt: 'desc', // Opcional: ordena os posts do mais novo para o mais antigo
      },
      include: {
        user: {
          select: { name: true }
        },
        category: {
          select: { name: true }
        }
      }
    });

    // 4. Pega o número total de posts no banco de dados
    const totalPosts = await prisma.post.count();

    // 5. Monta uma resposta mais completa, com os dados e informações sobre a paginação
    res.status(200).json({
      data: posts,
      pagination: {
        totalItems: totalPosts,
        totalPages: Math.ceil(totalPosts / pageSize),
        currentPage: page,
        pageSize: pageSize,
      },
    });

  } catch (error) {
    res.status(500).json({ error: 'Não foi possível listar as postagens.' });
  }
};
// Obter uma postagem específica pelo ID
export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: { select: { name: true } },
                category: { select: { name: true } }
            }
        });

        if (!post) {
            return res.status(404).json({ error: 'Postagem não encontrada.' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Não foi possível obter a postagem.' });
    }
};

// Atualizar uma postagem
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, categoryId } = req.body;

        const updatedPost = await prisma.post.update({
            where: { id: parseInt(id) },
            data: {
                title,
                content,
                categoryId: categoryId ? parseInt(categoryId) : undefined
            }
        });

        res.status(200).json(updatedPost);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Postagem não encontrada.' });
        }
        res.status(500).json({ error: 'Não foi possível atualizar a postagem.' });
    }
};

// Deletar uma postagem
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.post.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Postagem não encontrada.' });
        }
        res.status(500).json({ error: 'Não foi possível deletar a postagem.' });
    }
};
