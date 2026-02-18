import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '../input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'search'],
    },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
};

export const Email: Story = {
  args: { type: 'email', placeholder: 'you@example.com' },
};

export const Password: Story = {
  args: { type: 'password', placeholder: '••••••••' },
};

export const Disabled: Story = {
  args: { placeholder: 'Disabled input', disabled: true },
};

export const WithValue: Story = {
  args: { defaultValue: 'Hello, World!' },
};
