import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDogImage } from '../controllers/dogController';
import * as dogService from '../services/dogService';
import { Request, Response } from 'express';

vi.mock('../services/dogService');

describe('dogController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return a success response with dog image data', async () => {
        const mockedDogData = {
            imageUrl: 'https://images.dog.ceo/breeds/hound-english/n02089973_1.jpg',
            status: 'success'
        };

        vi.mocked(dogService.getRandomDogImage).mockResolvedValue(mockedDogData);

        const req = {} as Request;
        const res = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis()
        } as unknown as Response;

        await getDogImage(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockedDogData
        });
    });
});
