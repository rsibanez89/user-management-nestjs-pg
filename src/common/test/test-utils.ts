import { Repository } from 'typeorm';

// 1. Generic Mock Type
// This ensures that when you mock a dependency, you only mock the methods,
// not the properties, preventing TSLint/ESLint errors.
export type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

// 2. The Repository Mock Factory
// This covers 99% of CRUD + QueryBuilder cases.
// You can extend this later if you use transactions or raw queries.

export const repositoryMockFactory = (): MockType<Repository<any>> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  remove: jest.fn(),
  // QueryBuilder Mock
  createQueryBuilder: jest.fn(() => ({
    innerJoin: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockReturnThis(),
  })),
});
