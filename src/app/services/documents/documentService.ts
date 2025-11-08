import { mockDocuments, simulateApiDelay, generateId } from '../mock/mockData';

export interface Document {
  id: string;
  name: string;
  caseId: string;
  caseName: string;
  type: string;
  status: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  version: string;
}

export interface UploadDocumentDto {
  name: string;
  case: string;
  type: string;
  status?: string;
  notes?: string;
  file: File;
}

class DocumentService {
  private documents: Document[] = [...mockDocuments];

  async getAll(): Promise<Document[]> {
    await simulateApiDelay();
    return this.documents;
  }

  async getById(id: string): Promise<Document | null> {
    await simulateApiDelay();
    return this.documents.find(d => d.id === id) || null;
  }

  async getByCaseId(caseId: string): Promise<Document[]> {
    await simulateApiDelay();
    return this.documents.filter(d => d.caseId === caseId);
  }

  async upload(data: UploadDocumentDto): Promise<Document> {
    await simulateApiDelay(1200);

    const newDocument: Document = {
      id: generateId(),
      name: data.name,
      caseId: data.case,
      caseName: 'Название дела',
      type: data.type,
      status: data.status || 'draft',
      size: data.file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Александр',
      version: '1.0',
    };

    this.documents.unshift(newDocument);
    return newDocument;
  }

  async delete(id: string): Promise<boolean> {
    await simulateApiDelay(400);

    const index = this.documents.findIndex(d => d.id === id);
    if (index === -1) return false;

    this.documents.splice(index, 1);
    return true;
  }

  async download(_id: string): Promise<Blob> {
    await simulateApiDelay(800);

    return new Blob(['Mock document content'], { type: 'application/pdf' });
  }
}

export const documentService = new DocumentService();
