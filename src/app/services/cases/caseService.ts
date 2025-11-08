import { mockCases, simulateApiDelay, generateId } from '../mock/mockData';

export interface Case {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  category: string;
  status: string;
  priority: string;
  progress: number;
  deadline: string;
  fee: number;
  description: string;
  documents: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseDto {
  title: string;
  client: string;
  category: string;
  deadline?: string;
  fee?: string;
  description?: string;
  priority?: string;
}

class CaseService {
  private cases: Case[] = [...mockCases];

  async getAll(): Promise<Case[]> {
    await simulateApiDelay();
    return this.cases;
  }

  async getById(id: string): Promise<Case | null> {
    await simulateApiDelay();
    return this.cases.find(c => c.id === id) || null;
  }

  async create(data: CreateCaseDto): Promise<Case> {
    await simulateApiDelay(800);

    const newCase: Case = {
      id: generateId(),
      title: data.title,
      clientId: data.client,
      clientName: 'Новый клиент',
      category: data.category,
      status: 'new',
      priority: data.priority || 'medium',
      progress: 0,
      deadline: data.deadline || '',
      fee: data.fee ? parseFloat(data.fee) : 0,
      description: data.description || '',
      documents: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.cases.unshift(newCase);
    return newCase;
  }

  async update(id: string, data: Partial<Case>): Promise<Case | null> {
    await simulateApiDelay(600);

    const index = this.cases.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.cases[index] = {
      ...this.cases[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return this.cases[index];
  }

  async delete(id: string): Promise<boolean> {
    await simulateApiDelay(400);

    const index = this.cases.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.cases.splice(index, 1);
    return true;
  }

  async getPriorityCases(): Promise<Case[]> {
    await simulateApiDelay();
    return this.cases
      .filter(c => c.priority === 'high' || c.priority === 'urgent')
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }
}

export const caseService = new CaseService();
