import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import DndcadHeader from '../components/header/header.component';
import { Container } from '@mui/material';
import DndcadTopMenu from '../components/header/topMenu/topMenu.component';

const transparentStyle = {
  backgroundColor: 'transparent',
};
const headerStyle = {
  backgroundColor: 'transparent',
  height: 'auto',
};
const contentStyle = {
  width: '100%',
  maxWidth: '100%',
  padding: '25px',
  border: '2px solid #f2f1f1',
  borderRadius: '15px',
  boxSizing: 'border-box' as const,
};
const pageStyle = {
  maxWidth: 1200,
  width: '100%',
  margin: '0 auto',
  padding: '0 24px',
};

export const Route = createRootRoute({
  component: () => (
    <Container sx={{ ...transparentStyle, ...pageStyle }} disableGutters>
      <Container sx={headerStyle} disableGutters>
        <DndcadHeader />
        <DndcadTopMenu>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/generate">Generate</Link>
        </DndcadTopMenu>
      </Container>
      <Container sx={contentStyle}>
        <Outlet />
        <TanStackRouterDevtools />
      </Container>
    </Container>
  ),
});
