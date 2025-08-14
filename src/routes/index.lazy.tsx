import { createLazyFileRoute } from '@tanstack/react-router';
import DndcadHome from '../components/home/home.component';

const Index = () => <DndcadHome />;

export const Route = createLazyFileRoute('/')({
  component: Index,
});
