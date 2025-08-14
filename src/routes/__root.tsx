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
  backgroundColor: 'transparent',
  padding: '25px 50px',
  border: '2px solid #f2f1f1',
  margin: '0 25px',
  borderRadius: '15px',
};

export const Route = createRootRoute({
  component: () => (
    <Container style={transparentStyle} disableGutters>
      <Container style={headerStyle} disableGutters>
        <DndcadHeader />
        <DndcadTopMenu>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/generate">Generate</Link>
        </DndcadTopMenu>
      </Container>
      <Container className="dndcad-nav" style={contentStyle}>
        <Outlet />
        <TanStackRouterDevtools />
      </Container>
    </Container>
  ),
});
