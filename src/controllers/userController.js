import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Criar um novo usuário (você já tem este)
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Este e-mail já está em uso.' });
    }
    res.status(500).json({ error: 'Não foi possível criar o usuário.' });
  }
};

// Listar todos os usuários (você já tem este)
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível listar os usuários.' });
  }
};

// ==========================================================
// CÓDIGO NOVO ABAIXO
// ==========================================================

// Obter um usuário específico pelo ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID da URL
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id), // Converte o ID para número
      },
      select: { id: true, name: true, email: true } // Não retorna a senha
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível obter o usuário.' });
  }
};

// Atualizar um usuário
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const dataToUpdate = { name, email };

    // Se uma nova senha for fornecida, criptografa antes de atualizar
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: dataToUpdate,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    if (error.code === 'P2025') { // Código do Prisma para "registro não encontrado"
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(500).json({ error: 'Não foi possível atualizar o usuário.' });
  }
};

// Deletar um usuário
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    // 204 No Content é uma resposta padrão para delete bem-sucedido
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(500).json({ error: 'Não foi possível deletar o usuário.' });
  }
};

// src/controllers/userController.js

// ... outras funções

export const getPostsByUser = async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: parseInt(id), // Filtra os posts pelo ID do usuário
      },
      include: { // Opcional: incluir dados da categoria
        category: {
          select: { name: true }
        }
      }
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar os posts deste usuário.' });
  }
};