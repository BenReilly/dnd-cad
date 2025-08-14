import { createFileRoute } from '@tanstack/react-router';
import DndcadWelcomePage from '../components/home/welcomePage/welcomePage.component';

const About = () => {
  return <DndcadWelcomePage />;
};

export const Route = createFileRoute('/about')({
  component: About,
});
