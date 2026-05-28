import { prisma } from '../config/prisma';

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: [
      { type: 'asc' },
      { name: 'asc' },
    ],
  });
};
