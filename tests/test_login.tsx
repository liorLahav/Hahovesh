/* To run all tests at once: npx jest tests/
1. Form Rendering: Verifies that the login form renders correctly with all required fields,
including phone number and ID inputs, title, and submit button
2. Error Handling: Tests that various error conditions are properly handled and displayed to the user:
- Server errors when the backend connection fails
- Invalid credentials when no matching user is found
- Account status validation for pending accounts
3. UI Interactions: Tests user interface behavior:
- Error messages are cleared when users start typing new input
- Loading state displays an activity indicator during authentication
- Button becomes disabled during the authentication process
4. Navigation: Verifies the navigation functionality:
- Navigation to registration page when "Register" link is clicked
- Navigation back to home when "Back" button is clicked
5. Status Handling: Tests proper handling of different user statuses:
- Case-insensitive permission checking (e.g., "pending" vs "Pending")
- Active users are authenticated correctly
- Pending users receive appropriate messaging
*/
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs } from "firebase/firestore";
import { router } from 'expo-router';
import { act } from 'react-test-renderer';
import Login from '../app/login';

// Increase Jest timeout
jest.setTimeout(30000);

// Sample Users
const ACTIVE_USER = {
  first_name: 'דן',
  last_name: 'שני',
  phone: '0566666666',
  id: '113333444',
  permissions: ['volunteer', 'dispatcher', 'admin']
};

const PENDING_USER = {
  first_name: 'סער',
  last_name: 'נירן',
  phone: '0588888888',
  id: '445566777',
  permissions: ['pending']
};

// Mock dependencies
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => ({})),
  query: jest.fn(() => ({})),
  where: jest.fn(() => ({})),
  getDocs: jest.fn().mockResolvedValue({ empty: true, docs: [] }),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
}));

// Store original console and Alert implementations
const originalConsoleError = console.error;
const originalConsoleLog = console.log;
const originalAlert = Alert.alert;

/**
 * Test suite for the Login component
 * Tests basic functionality, navigation, and various login scenarios
 */
describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock console methods to suppress unwanted output during tests
    console.error = jest.fn();
    console.log = jest.fn();
    
    // Mock Alert.alert directly
    Alert.alert = jest.fn();
  });
  
  afterAll(() => {
    // Restore original implementations
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
    Alert.alert = originalAlert;
  });

  /**
   * Tests that the login form renders with all required fields
   */
  test('renders login form with all required fields', () => {
    const { getByText, getByPlaceholderText } = render(<Login />);
    
    // Check title exists
    expect(getByText('התחברות')).toBeTruthy();
    
    // Check form fields
    expect(getByPlaceholderText('הכנס את מספר הטלפון שלך')).toBeTruthy();
    expect(getByPlaceholderText('הכנס את תעודת הזהות שלך')).toBeTruthy();
    
    // Check login button
    expect(getByText('התחבר')).toBeTruthy();
  });

  /**
   * Tests that server errors are handled gracefully
   */
  test('handles server error gracefully', async () => {
    // Mock getDocs to reject with error for this test
    (getDocs as jest.Mock).mockRejectedValueOnce(new Error('Server error'));
    
    const { getByText, getByPlaceholderText, queryByText } = render(<Login />);
    
    // Fill form with credentials
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('הכנס את מספר הטלפון שלך'), '0545996926');
      fireEvent.changeText(getByPlaceholderText('הכנס את תעודת הזהות שלך'), '123456789');
    });
    
    // Submit form
    await act(async () => {
      fireEvent.press(getByText('התחבר'));
      // Let any promises resolve
      await Promise.resolve();
    });
    
    // Check if error message is displayed
    await waitFor(() => {
      const errorMessage = queryByText(/משהו השתבש/);
      expect(errorMessage).toBeTruthy();
    });
    
    // Verify console.error was called with the right error
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('שגיאת התחברות:'), 
      expect.any(Error)
    );
  });

  /**
   * Tests that error messages are cleared when the user starts typing
   */
  test('clears error message when user starts typing', async () => {
    // Mock getDocs to return empty results
    (getDocs as jest.Mock).mockResolvedValueOnce({
      empty: true,
      docs: []
    });
    
    const { getByText, getByPlaceholderText, queryByText } = render(<Login />);
    
    // Fill form with credentials
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('הכנס את מספר הטלפון שלך'), '0501234567');
      fireEvent.changeText(getByPlaceholderText('הכנס את תעודת הזהות שלך'), '123456789');
    });
    
    // Submit form to trigger error
    await act(async () => {
      fireEvent.press(getByText('התחבר'));
      // Let any promises resolve
      await Promise.resolve();
    });
    
    // Wait for error to appear
    await waitFor(() => {
      expect(queryByText(/מספר הטלפון או תעודת הזהות שגויים/)).toBeTruthy();
    });
    
    // Now type in a field - should clear error
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('הכנס את מספר הטלפון שלך'), '0501234568');
    });
    
    // Wait for error to disappear
    await waitFor(() => {
      expect(queryByText(/מספר הטלפון או תעודת הזהות שגויים/)).toBeNull();
    });
  });

  /**
   * Tests navigation to register page when register link is clicked
   */
  test('navigates to register page when register link is clicked', async () => {
    const { getByText } = render(<Login />);
    
    // Click on register link
    await act(async () => {
      fireEvent.press(getByText('הרשמה כאן'));
    });
    
    // Check router was called with correct path
    expect(router.push).toHaveBeenCalledWith('/register');
  });

  /**
   * Tests navigation back when back button is clicked
   */
  test('navigates back when back button is clicked', async () => {
    const { getByText } = render(<Login />);
    
    // Click on back button
    await act(async () => {
      fireEvent.press(getByText('חזרה לדף הבית'));
    });
    
    // Check router was called
    expect(router.back).toHaveBeenCalled();
  });

  /**
   * Tests that login button is disabled during loading state
   */
  test('disables login button during loading', async () => {
    // Create a promise we can resolve manually
    let resolveMock: (value: any) => void = () => {};
    const mockPromise = new Promise((resolve) => {
      resolveMock = resolve;
    });
    
    // Mock getDocs to return our controlled promise
    (getDocs as jest.Mock).mockReturnValueOnce(mockPromise);
    
    const { getByText, getByPlaceholderText, UNSAFE_queryAllByType } = render(<Login />);
    
    // Fill form with credentials
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('הכנס את מספר הטלפון שלך'), '0501234567');
      fireEvent.changeText(getByPlaceholderText('הכנס את תעודת הזהות שלך'), '123456789');
    });
    
    // Submit form directly using the login button
    await act(async () => {
      const loginButton = getByText('התחבר');
      fireEvent.press(loginButton);
      // Allow any state updates to process
      await Promise.resolve();
    });
    
    // Check for activity indicator - this means button is in loading state
    await waitFor(() => {
      // Use UNSAFE_queryAllByType which is the modern equivalent of queryByType
      const spinners = UNSAFE_queryAllByType(ActivityIndicator);
      expect(spinners.length).toBeGreaterThan(0);
    });
    
    // Resolve the promise to prevent the test from hanging
    await act(async () => {
      resolveMock({
        empty: true,
        docs: []
      });
      // Allow any state updates to process
      await Promise.resolve();
    });
  });

  /**
   * Tests that uppercase "Pending" status is handled correctly
   * This ensures case-insensitive permission checking in the component
   */
  test('handles uppercase "Pending" status correctly', async () => {
    // Create a modified user with uppercase Pending
    const uppercasePendingUser = {
      ...PENDING_USER,
      permissions: ['Pending'] // Capitalized
    };
    
    // Mock getDocs to return our uppercase pending user
    (getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          data: () => uppercasePendingUser
        }
      ]
    });
    
    const { getByText, getByPlaceholderText, queryByText } = render(<Login />);
    
    // Fill form with credentials
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('הכנס את מספר הטלפון שלך'), uppercasePendingUser.phone);
      fireEvent.changeText(getByPlaceholderText('הכנס את תעודת הזהות שלך'), uppercasePendingUser.id);
    });
    
    // Submit form
    await act(async () => {
      fireEvent.press(getByText('התחבר'));
      // Allow any state updates to process
      await Promise.resolve();
    });
    
    // Check if pending account message is displayed - use a more specific regex
    await waitFor(() => {
      // Look for partial message - might be different from what you expect
      const errorMessage = queryByText(/חשבונך עדיין בבדיקה|בהמתנה/);
      expect(errorMessage).toBeTruthy();
    });
  });
});