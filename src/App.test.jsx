import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// A simple test to verify testing setup
describe('Initial Test Setup', () => {
  it('Should render correctly', () => {
    render(<div data-testid="test-div">TaniCare</div>);
    expect(screen.getByTestId('test-div')).toBeInTheDocument();
  });
});
