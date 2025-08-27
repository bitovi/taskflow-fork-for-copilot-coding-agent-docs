/**
 * Tests for utility functions to ensure they work correctly
 */

import { parseDateString, formatDateForDisplay, formatDateForInput } from '@/lib/date-utils'

describe('Date Utilities', () => {
  test('parseDateString correctly parses valid date strings', () => {
    const testDate = '2024-01-15'
    const result = parseDateString(testDate)
    expect(result).toBeInstanceOf(Date)
    expect(result.getFullYear()).toBe(2024)
    expect(result.getMonth()).toBe(0) // January is 0
    expect(result.getDate()).toBe(15)
  })

  test('formatDateForDisplay formats dates correctly', () => {
    const testDate = new Date('2024-01-15T12:00:00Z')
    const result = formatDateForDisplay(testDate)
    expect(typeof result).toBe('string')
    expect(result).toMatch(/Jan 15/) // Basic format check
  })

  test('formatDateForInput formats dates for form inputs', () => {
    const testDate = new Date(2024, 0, 15) // January 15, 2024
    const result = formatDateForInput(testDate)
    expect(result).toBe('2024-01-15')
  })

  test('parseDateString handles edge cases', () => {
    // Test with valid date string
    const result = parseDateString('2023-12-25')
    expect(result.getFullYear()).toBe(2023)
    expect(result.getMonth()).toBe(11) // December
    expect(result.getDate()).toBe(25)
  })
})