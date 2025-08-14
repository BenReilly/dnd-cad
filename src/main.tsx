import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './index.css';
import UserProvider from './contexts/user.context.tsx';
import { RaceClassProvider } from './contexts/racesAndClasses.context.tsx';
import CharactersProvider from './contexts/characters.context.tsx';

import { routeTree } from './routeTree.gen.ts';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <RaceClassProvider>
        <CharactersProvider>
          <RouterProvider router={router} />
        </CharactersProvider>
      </RaceClassProvider>
    </UserProvider>
  </StrictMode>,
);
