import { OukekMyt } from '../index';

describe('OukekMyt SDK', () => {
  let sdk: OukekMyt;

  beforeEach(() => {
    sdk = new OukekMyt();
  });

  describe('add', () => {
    it('should add two numbers correctly', async () => {
      const result = await sdk.add(5, 3);
      expect(result).toBe(8);
    });

    it('should handle negative numbers', async () => {
      const result = await sdk.add(-5, 3);
      expect(result).toBe(-2);
    });

    it('should handle decimal numbers', async () => {
      const result = await sdk.add(1.5, 2.5);
      expect(result).toBe(4);
    });

    it('should throw error for invalid numbers', async () => {
      await expect(sdk.add(NaN, 3)).rejects.toThrow('Invalid numbers provided');
      await expect(sdk.add(3, NaN)).rejects.toThrow('Invalid numbers provided');
    });
  });

  describe('subtract', () => {
    it('should subtract two numbers correctly', async () => {
      const result = await sdk.subtract(5, 3);
      expect(result).toBe(2);
    });

    it('should handle negative numbers', async () => {
      const result = await sdk.subtract(-5, 3);
      expect(result).toBe(-8);
    });

    it('should handle decimal numbers', async () => {
      const result = await sdk.subtract(5.5, 2.5);
      expect(result).toBe(3);
    });

    it('should throw error for invalid numbers', async () => {
      await expect(sdk.subtract(NaN, 3)).rejects.toThrow('Invalid numbers provided');
      await expect(sdk.subtract(3, NaN)).rejects.toThrow('Invalid numbers provided');
    });
  });
}); 