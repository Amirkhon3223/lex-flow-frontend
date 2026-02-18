import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from '../textarea';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
};

export const Disabled: Story = {
  args: { placeholder: 'Disabled', disabled: true },
};

export const WithValue: Story = {
  args: { defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
};
