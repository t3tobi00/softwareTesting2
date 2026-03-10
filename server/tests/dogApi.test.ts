import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import dogRoutes from '../routes/dogRoutes';

const app = express();
app.use(express.json());
app.use('/api/dogs', dogRoutes);

app.use((_req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

describe('API test', () => {
    it('should return 200 and success true with dog image data', async () => {
        const response = await request(app).get('/api/dogs/random');
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toHaveProperty('imageUrl');
        expect(typeof response.body.data.imageUrl).toBe('string');
    });

    it('should return 404 and error message for invalid route', async () => {
        const response = await request(app).get('/api/dogs/invalid');
        
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Route not found');
    });
});
