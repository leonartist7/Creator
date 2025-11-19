// API Integration Tests for Masterwork Library (US2)
// TDD Red Phase - T046-T049
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { testMasterworks } from '../../../tests/fixtures/masterworks';

const API_URL = 'http://localhost:3001';

describe('Masterwork Library API (US2)', () => {
  let uploadedMasterworkIds: string[] = [];
  const userId = 'test-user-library';

  beforeAll(async () => {
    // Upload test masterworks for library testing
    // In real implementation, this would seed the database
    // For now, we'll test against the API directly
  });

  afterAll(async () => {
    // Clean up test data
    for (const id of uploadedMasterworkIds) {
      await fetch(`${API_URL}/api/masterworks/${id}`, {
        method: 'DELETE'
      }).catch(() => {});
    }
  });

  describe('T046: GET /api/masterworks - List masterworks with pagination', () => {
    it('should return paginated list of masterworks', async () => {
      const response = await fetch(`${API_URL}/api/masterworks?userId=${userId}`);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('masterworks');
      expect(data).toHaveProperty('total');
      expect(data).toHaveProperty('page');
      expect(data).toHaveProperty('pageSize');
      expect(Array.isArray(data.masterworks)).toBe(true);
    });

    it('should support pagination parameters', async () => {
      const response = await fetch(
        `${API_URL}/api/masterworks?userId=${userId}&page=1&pageSize=10`
      );

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.page).toBe(1);
      expect(data.pageSize).toBe(10);
      expect(data.masterworks.length).toBeLessThanOrEqual(10);
    });

    it('should support different page sizes', async () => {
      const pageSizes = [5, 10, 20, 50];

      for (const pageSize of pageSizes) {
        const response = await fetch(
          `${API_URL}/api/masterworks?userId=${userId}&pageSize=${pageSize}`
        );

        const data = await response.json();
        expect(data.pageSize).toBe(pageSize);
        expect(data.masterworks.length).toBeLessThanOrEqual(pageSize);
      }
    });

    it('should return empty array when no masterworks exist', async () => {
      const newUserId = 'empty-user-' + Date.now();
      const response = await fetch(`${API_URL}/api/masterworks?userId=${newUserId}`);

      const data = await response.json();
      expect(data.masterworks).toEqual([]);
      expect(data.total).toBe(0);
    });

    it('should support sorting by upload date descending', async () => {
      const response = await fetch(
        `${API_URL}/api/masterworks?userId=${userId}&sortBy=uploadDate&sortOrder=desc`
      );

      const data = await response.json();

      if (data.masterworks.length > 1) {
        const dates = data.masterworks.map((m: any) => new Date(m.uploadDate).getTime());
        const sortedDates = [...dates].sort((a, b) => b - a);
        expect(dates).toEqual(sortedDates);
      }
    });

    it('should support sorting by title ascending', async () => {
      const response = await fetch(
        `${API_URL}/api/masterworks?userId=${userId}&sortBy=title&sortOrder=asc`
      );

      const data = await response.json();

      if (data.masterworks.length > 1) {
        const titles = data.masterworks.map((m: any) => m.title);
        const sortedTitles = [...titles].sort();
        expect(titles).toEqual(sortedTitles);
      }
    });

    it('should support sorting by word count', async () => {
      const response = await fetch(
        `${API_URL}/api/masterworks?userId=${userId}&sortBy=wordCount&sortOrder=desc`
      );

      const data = await response.json();

      if (data.masterworks.length > 1) {
        const wordCounts = data.masterworks.map((m: any) => m.wordCount);
        const sortedCounts = [...wordCounts].sort((a, b) => b - a);
        expect(wordCounts).toEqual(sortedCounts);
      }
    });
  });

  describe('T047: GET /api/masterworks with filtering', () => {
    it('should filter by format', async () => {
      const response = await fetch(
        `${API_URL}/api/masterworks?userId=${userId}&format=PDF`
      );

      const data = await response.json();

      if (data.masterworks.length > 0) {
        data.masterworks.forEach((m: any) => {
          expect(m.format).toBe('PDF');
        });
      }
    });

    it('should filter by analysis status', async () => {
      const response = await fetch(
        `${API_URL}/api/masterworks?userId=${userId}&analysisStatus=completed`
      );

      const data = await response.json();

      if (data.masterworks.length > 0) {
        data.masterworks.forEach((m: any) => {
          expect(m.analysisStatus).toBe('completed');
        });
      }
    });

    it('should filter by tags', async () => {
      const response = await fetch(
        `${API_URL}/api/masterworks?userId=${userId}&tags[]=horror&tags[]=thriller`
      );

      const data = await response.json();

      if (data.masterworks.length > 0) {
        data.masterworks.forEach((m: any) => {
          const hasTags = m.customTags.some((tag: string) =>
            ['horror', 'thriller'].includes(tag)
          );
          expect(hasTags).toBe(true);
        });
      }
    });

    it('should combine multiple filters', async () => {
      const response = await fetch(
        `${API_URL}/api/masterworks?userId=${userId}&format=PDF&analysisStatus=completed`
      );

      const data = await response.json();

      if (data.masterworks.length > 0) {
        data.masterworks.forEach((m: any) => {
          expect(m.format).toBe('PDF');
          expect(m.analysisStatus).toBe('completed');
        });
      }
    });
  });

  describe('T048: PATCH /api/masterworks/:id - Update masterwork', () => {
    it('should update masterwork title', async () => {
      // Assume we have at least one masterwork
      const listResponse = await fetch(`${API_URL}/api/masterworks?userId=${userId}`);
      const listData = await listResponse.json();

      if (listData.masterworks.length === 0) {
        console.warn('No masterworks available for update test');
        return;
      }

      const masterwork = listData.masterworks[0];
      const newTitle = 'Updated Title ' + Date.now();

      const response = await fetch(`${API_URL}/api/masterworks/${masterwork.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.masterwork.title).toBe(newTitle);
      expect(data.masterwork.id).toBe(masterwork.id);
    });

    it('should update custom tags', async () => {
      const listResponse = await fetch(`${API_URL}/api/masterworks?userId=${userId}`);
      const listData = await listResponse.json();

      if (listData.masterworks.length === 0) {
        return;
      }

      const masterwork = listData.masterworks[0];
      const newTags = ['updated-tag-1', 'updated-tag-2'];

      const response = await fetch(`${API_URL}/api/masterworks/${masterwork.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customTags: newTags })
      });

      const data = await response.json();
      expect(data.masterwork.customTags).toEqual(newTags);
    });

    it('should update rating', async () => {
      const listResponse = await fetch(`${API_URL}/api/masterworks?userId=${userId}`);
      const listData = await listResponse.json();

      if (listData.masterworks.length === 0) {
        return;
      }

      const masterwork = listData.masterworks[0];

      const response = await fetch(`${API_URL}/api/masterworks/${masterwork.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: 5 })
      });

      const data = await response.json();
      expect(data.masterwork.rating).toBe(5);
    });

    it('should update user notes', async () => {
      const listResponse = await fetch(`${API_URL}/api/masterworks?userId=${userId}`);
      const listData = await listResponse.json();

      if (listData.masterworks.length === 0) {
        return;
      }

      const masterwork = listData.masterworks[0];
      const newNotes = 'Updated notes at ' + new Date().toISOString();

      const response = await fetch(`${API_URL}/api/masterworks/${masterwork.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userNotes: newNotes })
      });

      const data = await response.json();
      expect(data.masterwork.userNotes).toBe(newNotes);
    });

    it('should reject updates with invalid rating', async () => {
      const listResponse = await fetch(`${API_URL}/api/masterworks?userId=${userId}`);
      const listData = await listResponse.json();

      if (listData.masterworks.length === 0) {
        return;
      }

      const masterwork = listData.masterworks[0];

      const response = await fetch(`${API_URL}/api/masterworks/${masterwork.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: 10 })
      });

      expect(response.status).toBe(400);
    });

    it('should return 404 for non-existent masterwork', async () => {
      const response = await fetch(`${API_URL}/api/masterworks/non-existent-id`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test' })
      });

      expect(response.status).toBe(404);
    });
  });

  describe('T049: DELETE /api/masterworks/:id - Delete masterwork', () => {
    it('should delete a masterwork', async () => {
      const listResponse = await fetch(`${API_URL}/api/masterworks?userId=${userId}`);
      const listData = await listResponse.json();

      if (listData.masterworks.length === 0) {
        console.warn('No masterworks available for delete test');
        return;
      }

      const masterwork = listData.masterworks[0];

      const response = await fetch(`${API_URL}/api/masterworks/${masterwork.id}`, {
        method: 'DELETE'
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.message).toContain('deleted');

      // Verify it's gone
      const getResponse = await fetch(`${API_URL}/api/masterworks/${masterwork.id}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when deleting non-existent masterwork', async () => {
      const response = await fetch(`${API_URL}/api/masterworks/non-existent-id`, {
        method: 'DELETE'
      });

      expect(response.status).toBe(404);
    });

    it('should delete associated file from storage', async () => {
      // This test would verify file deletion from storage
      // Implementation depends on storage layer
    });
  });

  describe('GET /api/masterworks/:id - Get single masterwork', () => {
    it('should return a single masterwork by ID', async () => {
      const listResponse = await fetch(`${API_URL}/api/masterworks?userId=${userId}`);
      const listData = await listResponse.json();

      if (listData.masterworks.length === 0) {
        return;
      }

      const masterwork = listData.masterworks[0];

      const response = await fetch(`${API_URL}/api/masterworks/${masterwork.id}`);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.masterwork.id).toBe(masterwork.id);
      expect(data.masterwork).toHaveProperty('title');
      expect(data.masterwork).toHaveProperty('format');
      expect(data.masterwork).toHaveProperty('wordCount');
    });

    it('should return 404 for non-existent masterwork', async () => {
      const response = await fetch(`${API_URL}/api/masterworks/non-existent-id`);
      expect(response.status).toBe(404);
    });

    it('should update lastAccessed timestamp', async () => {
      const listResponse = await fetch(`${API_URL}/api/masterworks?userId=${userId}`);
      const listData = await listResponse.json();

      if (listData.masterworks.length === 0) {
        return;
      }

      const masterwork = listData.masterworks[0];
      const beforeAccess = new Date();

      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay

      await fetch(`${API_URL}/api/masterworks/${masterwork.id}`);

      // Fetch again to check timestamp
      const response = await fetch(`${API_URL}/api/masterworks/${masterwork.id}`);
      const data = await response.json();

      const lastAccessed = new Date(data.masterwork.lastAccessed);
      expect(lastAccessed.getTime()).toBeGreaterThanOrEqual(beforeAccess.getTime());
    });
  });
});
