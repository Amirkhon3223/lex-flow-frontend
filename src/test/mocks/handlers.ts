// API mock handlers for testing
// Can be used with MSW (Mock Service Worker) if needed

export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  firstName: 'Test',
  lastName: 'User',
  isActive: true,
  twoFactorEnabled: false,
  language: 'en',
  timezone: 'UTC',
  currency: 'USD',
};

export const mockWorkspace = {
  id: 'workspace-123',
  name: 'Test Workspace',
  ownerId: 'user-123',
};

export const mockClient = {
  id: 'client-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  type: 'individual',
  category: 'standard',
  status: 'active',
  workspaceId: 'workspace-123',
};

export const mockCase = {
  id: 'case-123',
  title: 'Test Case',
  clientId: 'client-123',
  clientName: 'John Doe',
  category: 'civil',
  status: 'in_progress',
  priority: 'medium',
  progress: 50,
  workspaceId: 'workspace-123',
};

export const mockMeeting = {
  id: 'meeting-123',
  title: 'Test Meeting',
  date: '2026-02-15',
  time: '14:00',
  duration: '1h',
  type: 'video',
  status: 'scheduled',
  clientId: 'client-123',
  clientName: 'John Doe',
  workspaceId: 'workspace-123',
};

export const mockTemplate = {
  id: 'template-123',
  name: 'Test Template',
  description: 'A test template',
  category: 'contract',
  content: 'Hello {{client.name}}, this is a test.',
  variables: ['client.name'],
  isSystem: false,
  workspaceId: 'workspace-123',
};
