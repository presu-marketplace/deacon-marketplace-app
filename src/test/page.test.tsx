import { render, screen } from '@testing-library/react'
import TestPage from './page'

const mockSelect = jest.fn()

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({ select: mockSelect })),
  },
}))

describe('TestPage', () => {
  beforeEach(() => {
    mockSelect.mockReset()
  })

  it('shows loading message before data', async () => {
    const mockData = [{ id: '1', email: 'test@example.com' }]
    mockSelect.mockResolvedValueOnce({ data: mockData, error: null })
    render(<TestPage />)
    expect(
      screen.getByText('Loading data from Supabase...')
    ).toBeInTheDocument()
    expect(await screen.findByText(/test@example.com/)).toBeInTheDocument()
  })

  it('renders data when the fetch succeeds', async () => {
    const mockData = [{ id: '1', email: 'john@example.com' }]
    mockSelect.mockResolvedValueOnce({ data: mockData, error: null })
    render(<TestPage />)
    expect(await screen.findByText(/john@example.com/)).toBeInTheDocument()
  })

  it('renders error message when the fetch fails', async () => {
    mockSelect.mockResolvedValueOnce({
      data: null,
      error: { message: 'Failed to fetch' },
    })
    render(<TestPage />)
    expect(
      await screen.findByText(/Error: Failed to fetch/)
    ).toBeInTheDocument()
  })
})

