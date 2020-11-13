import React from 'react'
import { render } from '@testing-library/react'
import Dashboard from '../Dashboard'
import '@testing-library/jest-dom/extend-expect'

test('renders learn react link', () => {
  const { getByText } = render(<Dashboard />)
  const divElement = getByText(/Temperature/i)
  expect(divElement).toBeInTheDocument()
  const divElement2 = getByText(/Air pressure/i)
  expect(divElement2).toBeInTheDocument()
  const divElement3 = getByText(/Humidity/i)
  expect(divElement3).toBeInTheDocument()
})
