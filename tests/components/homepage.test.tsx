import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, test, expect, beforeEach } from 'vitest';

vi.mock('@/components/MapView', () => ({
  MapView: () => <div data-testid="map-view">mock map</div>,
}));

import HomePage from '@/../app/page';

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes('/api/residential/')) {
        return new Response(JSON.stringify({ item: null, items: [] }), { status: 200 });
      }
      return new Response(
        JSON.stringify({
          items: [{ id: 'r-001', name: '静安公馆', district: '静安区', coordinates: [121.47, 31.23] }],
          districtStats: [{ name: '静安区', residentialCount: 1 }],
          source: 'mock',
        }),
        { status: 200 },
      );
    }),
  );
});

test('renders map page shell and data blocks', async () => {
  render(<HomePage />);
  expect(screen.getByText('上海住房地图 MVP')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByTestId('district-stats')).toHaveTextContent('静安区: 1'));
});
