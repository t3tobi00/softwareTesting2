import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import dogRoutes from '../routes/dogRoutes';
import * as dogController from '../controllers/dogController';

vi.mock('../controllers/dogController');

const app = express();
app.use(express.json());
app.use('/api/dogs', dogRoutes);

describe('dogRoutes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 200 and success true with image url', async () => {
        vi.mocked(dogController.getDogImage).mockImplementation(async (req, res) => {
            res.json({
                success: true,
                data: {
                    imageUrl: 'https://images.dog.ceo/breeds/hound-english/n02089973_1.jpg',
                    status: 'success'
                }
            });
        });

        const response = await request(app).get('/api/dogs/random');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.imageUrl).toBe('https://images.dog.ceo/breeds/hound-english/n02089973_1.jpg');
    });

    it('should return 500 when there is an internal server error', async () => {
        vi.mocked(dogController.getDogImage).mockImplementation(async (req, res) => {
            res.status(500).json({
                success: false,
                error: "Failed to fetch dog image: Network error"
            });
        });

        const response = await request(app).get('/api/dogs/random');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Failed to fetch dog image: Network error');
        expect(response.body.success).toBe(false);
    });
});
