import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchAppBar from '../components/SearchAndFilterScreen/Search';

test('renders SearchAppBar component', () => {
  render(<SearchAppBar />);
  const searchInput = screen.getByPlaceholderText('חיפוש...');
  expect(searchInput).toBeInTheDocument();
});

test('handles search input change', () => {
  render(<SearchAppBar />);
  const searchInput = screen.getByPlaceholderText('חיפוש...');
  fireEvent.change(searchInput, { target: { value: 'test search' } });
  expect(searchInput.value).toBe('test search');
});