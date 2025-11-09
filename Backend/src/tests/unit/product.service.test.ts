import { createProduct, listProducts } from '../../modules/product/product.service';
import { Product } from '../../modules/product/product.model';
import { createTestUser } from '../testUtils';

describe('ProductService', () => {
  let testUser: any;

  beforeEach(async () => {
    testUser = await createTestUser();
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
        category: 'electronics',
        createdBy: testUser._id,
      };

      const product = await createProduct(productData);

      expect(product).toBeDefined();
      expect(product.name).toBe(productData.name);
      expect(product.price).toBe(productData.price);
      expect(product.stock).toBe(productData.stock);
    });

    it('should throw error for invalid price', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: -10,
        stock: 5,
        category: 'electronics',
        createdBy: testUser._id,
      };

      await expect(createProduct(productData)).rejects.toThrow();
    });
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      await Product.create(
        { name: 'Product 1', description: 'Description 1', price: 10, stock: 5, category: 'electronics', createdBy: testUser._id },
      );

      const result = await listProducts({}, {}, 1, 10);

      expect(result.docs).toHaveLength(1);
      expect(result.totalPages).toBe(1);
      expect(result.page).toBe(1);
    });
  });
});