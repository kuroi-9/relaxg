// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
}))

// Mock @stackframe/stack
jest.mock('@stackframe/stack', () => ({
  useUser: () => ({
    user: null,
    signOut: jest.fn(),
  }),
})) 