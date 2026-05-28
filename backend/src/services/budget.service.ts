import { prisma } from '../config/prisma';
import { Prisma } from '@prisma/client';

export const getBudgets = async (userId: string, monthYear?: Date) => {
  const where: Prisma.BudgetWhereInput = { user_id: userId };
  if (monthYear) {
    where.month_year = monthYear;
  }

  return await prisma.budget.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: {
      month_year: 'desc',
    },
  });
};

export const upsertBudget = async (
  userId: string,
  categoryId: number,
  monthlyLimit: number,
  monthYear: Date
) => {
  // Verify the category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw new Error(`Category with id ${categoryId} not found`);
  }

  const existing = await prisma.budget.findFirst({
    where: {
      user_id: userId,
      category_id: categoryId,
      month_year: monthYear,
    },
  });

  if (existing) {
    return await prisma.budget.update({
      where: { id: existing.id },
      data: { monthly_limit: monthlyLimit },
      include: { category: true },
    });
  }

  return await prisma.budget.create({
    data: {
      user_id: userId,
      category_id: categoryId,
      monthly_limit: monthlyLimit,
      month_year: monthYear,
    },
    include: { category: true },
  });
};

export const getBudgetStatus = async (userId: string, monthYear?: Date) => {
  const now = new Date();
  const targetMonth = monthYear || new Date(now.getFullYear(), now.getMonth(), 1);

  const budgets = await getBudgets(userId, targetMonth);

  const endOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);

  // Get actual spending per category for this month
  const results = await Promise.all(
    budgets.map(async (budget) => {
      const spending = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          user_id: userId,
          category_id: budget.category_id,
          transaction_date: {
            gte: targetMonth,
            lte: endOfMonth,
          },
          category: {
            type: 'EXPENSE',
          },
        },
      });

      const spent = Number(spending._sum.amount || 0);
      const limit = Number(budget.monthly_limit);
      const percentage = limit > 0 ? (spent / limit) * 100 : 0;

      return {
        category: budget.category,
        monthly_limit: limit,
        spent,
        remaining: limit - spent,
        percentage: Math.round(percentage * 100) / 100,
        status: percentage >= 100 ? 'OVER_BUDGET' : percentage >= 80 ? 'WARNING' : 'OK',
      };
    })
  );

  return results;
};
