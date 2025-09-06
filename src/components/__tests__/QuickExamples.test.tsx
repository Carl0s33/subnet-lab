import { render, screen, fireEvent } from '@testing-library/react';
import { QuickExamples } from '../QuickExamples';
import { describe, it, expect, vi } from 'vitest';

describe('QuickExamples', () => {
  it('renders the component with example buttons', () => {
    const onSelect = vi.fn();
    render(<QuickExamples onSelect={onSelect} />);

    // Check if the component renders
    expect(screen.getByText('Exemplos rápidos:')).toBeInTheDocument();
    
    // Check if example buttons are rendered
    expect(screen.getByText('/24')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('255.255.255.0')).toBeInTheDocument();
    expect(screen.getByText('255.255.0.0')).toBeInTheDocument();
    expect(screen.getByText('255.0.0.0')).toBeInTheDocument();
  });

  it('calls onSelect with the correct value when an example is clicked', () => {
    const onSelect = vi.fn();
    render(<QuickExamples onSelect={onSelect} />);

    // Click on an example button
    fireEvent.click(screen.getByText('/24'));
    
    // Check if onSelect was called with the correct value
    expect(onSelect).toHaveBeenCalledWith('/24');
  });

  it('applies custom className when provided', () => {
    const onSelect = vi.fn();
    const { container } = render(
      <QuickExamples onSelect={onSelect} className="custom-class" />
    );
    
    // Check if the custom class is applied
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
