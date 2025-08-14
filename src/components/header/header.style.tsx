import { styled } from '@mui/material/styles';

export const DndcadHeaderDiv = styled('div')`
  background: url('/dndcad-header-logo.png') no-repeat center;
  height: 140px;
  display: flex;
`;

export const DndcadHeaderID = styled('div')`
  width: 960px;
  position: relative;
  bottom: -2rem;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-end;
  justify-content: flex-end;

  p {
    align-self: center;
    padding-right: 15px;
    font-size: 16px;

    &:last-child {
      padding-right: 0;
    }
  }
`;
