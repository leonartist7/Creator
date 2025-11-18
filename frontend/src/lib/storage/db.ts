// IndexedDB wrapper for local project storage

export interface Project {
  id: string;
  title: string;
  type: 'ebook' | 'course' | 'guide' | 'template' | 'workbook';
  content: {
    html: string;
    text?: string;
    json?: any;
  };
  metadata: {
    wordCount: number;
    characterCount: number;
    lastEdited: Date;
    created: Date;
    tags: string[];
  };
  status: 'draft' | 'in_progress' | 'completed' | 'published';
  structure?: any[]; // For organizing chapters, modules, etc.
}

const DB_NAME = 'CreatorDB';
const DB_VERSION = 1;
const PROJECTS_STORE = 'projects';

class Database {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create projects store
        if (!db.objectStoreNames.contains(PROJECTS_STORE)) {
          const projectStore = db.createObjectStore(PROJECTS_STORE, {
            keyPath: 'id',
          });

          // Create indexes
          projectStore.createIndex('type', 'type', { unique: false });
          projectStore.createIndex('status', 'status', { unique: false });
          projectStore.createIndex('created', 'metadata.created', {
            unique: false,
          });
          projectStore.createIndex('lastEdited', 'metadata.lastEdited', {
            unique: false,
          });
        }
      };
    });
  }

  private getStore(mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction([PROJECTS_STORE], mode);
    return transaction.objectStore(PROJECTS_STORE);
  }

  // Projects
  async getAllProjects(): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore();
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getProject(id: string): Promise<Project | undefined> {
    return new Promise((resolve, reject) => {
      const store = this.getStore();
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async saveProject(project: Project): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');

      // Update lastEdited timestamp
      project.metadata.lastEdited = new Date();

      const request = store.put(project);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async deleteProject(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getProjectsByType(type: Project['type']): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore();
      const index = store.index('type');
      const request = index.getAll(type);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getProjectsByStatus(status: Project['status']): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore();
      const index = store.index('status');
      const request = index.getAll(status);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async searchProjects(query: string): Promise<Project[]> {
    const allProjects = await this.getAllProjects();
    const lowerQuery = query.toLowerCase();

    return allProjects.filter(
      (project) =>
        project.title.toLowerCase().includes(lowerQuery) ||
        project.content.text?.toLowerCase().includes(lowerQuery) ||
        project.metadata.tags.some((tag) =>
          tag.toLowerCase().includes(lowerQuery)
        )
    );
  }

  async getRecentProjects(limit = 10): Promise<Project[]> {
    const allProjects = await this.getAllProjects();
    return allProjects
      .sort(
        (a, b) =>
          new Date(b.metadata.lastEdited).getTime() -
          new Date(a.metadata.lastEdited).getTime()
      )
      .slice(0, limit);
  }

  async exportAllData(): Promise<{ projects: Project[] }> {
    const projects = await this.getAllProjects();
    return { projects };
  }

  async importData(data: { projects: Project[] }): Promise<void> {
    for (const project of data.projects) {
      await this.saveProject(project);
    }
  }

  async clearAllData(): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

// Singleton instance
export const db = new Database();

// Initialize on module load
db.init().catch(console.error);

// Helper functions
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createProject(
  title: string,
  type: Project['type']
): Project {
  return {
    id: generateId(),
    title,
    type,
    content: {
      html: '',
      text: '',
    },
    metadata: {
      wordCount: 0,
      characterCount: 0,
      lastEdited: new Date(),
      created: new Date(),
      tags: [],
    },
    status: 'draft',
  };
}

export function updateWordCount(project: Project): Project {
  const text = project.content.text || '';
  const words = text.trim().split(/\s+/).filter(Boolean);

  return {
    ...project,
    metadata: {
      ...project.metadata,
      wordCount: words.length,
      characterCount: text.length,
    },
  };
}
