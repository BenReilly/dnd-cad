import { render, screen } from '@testing-library/react';
import DndcadHeader from './header.component';
import { describe, it, expect } from 'vitest';
import { UserContext } from '../../contexts/user.context';
import { UserData } from '../../types/User.Types.js';
import { mockedUserData } from '../../utils/mockedTestData.js';

describe('DndcadHeader', () => {
  const renderWithUser = (user: UserData | null) => {
    return render(
      <UserContext.Provider
        value={{ currentUser: user, setCurrentUser: () => {} }}
      >
        <DndcadHeader />;
      </UserContext.Provider>,
    );
  };

  it('renders the welcome with no user', () => {
    render(<DndcadHeader />);
    expect(screen.getByText('Welcome Guest')).toBeInTheDocument();
  });

  it('renders the welcome with name', () => {
    renderWithUser(mockedUserData);
    expect(screen.getByText('Welcome Foo')).toBeInTheDocument();
  });

  it('renders a login button if there is no user', () => {
    render(<DndcadHeader />);
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
  });
  it('renders a log out button if there is a user', () => {
    renderWithUser(mockedUserData);
    expect(
      screen.getByRole('button', { name: /sign out/i }),
    ).toBeInTheDocument();
  });
});
