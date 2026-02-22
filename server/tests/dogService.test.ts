import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRandomDogImage } from '../services/dogService';

global.fetch = vi.fn();

describe('dogService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return dog image data when api call is successful', async () => {
    const mockApiResponse = {
      message: 'https://images.dog.ceo/breeds/hound-english/n02089973_1.jpg',
      status: 'success',
    };

    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });

    const result = await getRandomDogImage();

    expect(result.imageUrl).toBe(mockApiResponse.message);
    expect(result.status).toBe('success');
    expect(fetch).toHaveBeenCalledOnce();
  });

  it('should throw an error when the api call fails', async () => {
    const mockFailedResponse = {
      ok: false,
      status: 500,
    };

    (fetch as any).mockResolvedValue(mockFailedResponse);

    await expect(getRandomDogImage()).rejects.toThrow('Failed to fetch dog image: Dog API returned status 500');
  });
});
