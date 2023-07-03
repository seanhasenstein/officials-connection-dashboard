import styled from 'styled-components';

export default styled.div`
  display: none;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 200;
  &.visible {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
