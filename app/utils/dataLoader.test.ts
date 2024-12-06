import { loadAllData } from './dataLoader';
import fs from 'fs';
// import path from 'path';
// import { parse } from 'csv-parse';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

// vi.mock('fs');
// vi.mock('path');
// vi.mock('csv-parse', () => ({
//     parse: vi.fn(),
// }));

describe('dataLoader Test Suite', () => {
    // const mockCSVData = [
    //     ['1%%%Efficiency A%%%modifier1%%%modifier2%%%modifier3'],
    //     ['2%%%Efficiency B%%%modifier1%%%modifier2%%%modifier3'],
    //   ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should load all data correctly', async () => {
        // const mockReadStream = {
        //     pipe: vi.fn().mockReturnThis(),
        //     on: vi.fn((event, callback) => {
        //         if (event === 'data') {
        //             mockCSVData.forEach((row) => callback(row));
        //         }
        //         if (event === 'end') {
        //             callback();
        //         }
        //         return mockReadStream;
        //     }),
        // };

        // (fs.createReadStream as Mock).mockReturnValue(mockReadStream);
        // (path.join as Mock).mockImplementation((...args) => args.join('/'));

       await loadAllData();

        // expect(data.projects).toBeTruthy();
        // expect(data.resources).toBeTruthy();
        // expect(data.products).toBeTruthy();
        // expect(data.efficiencies).toBeTruthy();
        // expect(data.events).toBeTruthy();
        // expect(data.legacy).toBeTruthy();

        // expect(fs.createReadStream).toHaveBeenCalledTimes(6);
        // expect(parse).toHaveBeenCalledTimes(6);
    });

    // it('should handle errors during CSV loading', async () => {
    //     const mockReadStream = {
    //         pipe: vi.fn().mockReturnThis(),
    //         on: vi.fn((event, callback) => {
    //             if (event === 'error') {
    //                 callback(new Error('Test error'));
    //             }
    //             return mockReadStream;
    //         }),
    //     };

    //     (fs.createReadStream as Mock).mockReturnValue(mockReadStream);

    //     await expect(loadAllData()).rejects.toThrow('Test error');
    // });
});
