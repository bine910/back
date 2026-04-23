import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  const getRawMany = jest.fn();
  const mockQueryBuilder = {
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    addGroupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getRawMany,
  };

  const mockProductRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  describe('searchSuggestions', () => {
    it('returns prefix-matched suggestions in compact card-like shape', async () => {
      getRawMany.mockResolvedValue([
        {
          id: '1',
          slug: 'basic-cotton-t-shirt-0',
          name: 'Basic Cotton T-Shirt',
          thumbnail_url: 'https://cdn.example.com/p0.jpg',
          base_price: '19900.00',
          final_price: '17910.00',
          discount_percent: '10',
        },
      ]);

      const result = await service.searchSuggestions({ q: 'bas', limit: 8 });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'LOWER(p.name) LIKE :prefix',
        { prefix: 'bas%' },
      );
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(8);
      expect(result).toEqual([
        {
          id: 1,
          slug: 'basic-cotton-t-shirt-0',
          name: 'Basic Cotton T-Shirt',
          thumbnail_url: 'https://cdn.example.com/p0.jpg',
          base_price: 19900,
          final_price: 17910,
          discount_percent: 10,
        },
      ]);
    });

    it('trims query before building prefix filter', async () => {
      getRawMany.mockResolvedValue([]);

      await service.searchSuggestions({ q: '  tee ', limit: 5 });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'LOWER(p.name) LIKE :prefix',
        { prefix: 'tee%' },
      );
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(5);
    });
  });
});
