// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const transaction = transactionRepository.create({
      title,
      value,
      type,
    });

    const categoryFound = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (categoryFound) {
      transaction.category_id = categoryFound.id;
    } else {
      const categoryCreated = categoryRepository.create({ title: category });
      await categoryRepository.save(categoryCreated);
      transaction.category_id = categoryCreated.id;
    }

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
