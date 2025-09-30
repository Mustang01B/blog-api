import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Criar uma nova categoria
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'O nome é obrigatório.' });
    }

    const newCategory = await prisma.category.create({
      data: { name },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === 'P2002') { // Erro de campo único (nome da categoria)
      return res.status(409).json({ error: 'Esta categoria já existe.' });
    }
    res.status(500).json({ error: 'Não foi possível criar a categoria.' });
  }
};

// Listar todas as categorias
export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível listar as categorias.' });
  }
};

// Atualizar uma categoria
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }
    res.status(500).json({ error: 'Não foi possível atualizar a categoria.' });
  }
};

// Deletar uma categoria
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }
    // Erro P2003 indica que a categoria está sendo usada por um post
    if (error.code === 'P2003') {
        return res.status(409).json({ error: 'Não é possível deletar a categoria pois ela está associada a postagens.' });
    }
    res.status(500).json({ error: 'Não foi possível deletar a categoria.' });
  }
};