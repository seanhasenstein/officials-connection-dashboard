import OverlayComponent from './styles';

type Props = {
  children: React.ReactNode;
  isVisible: boolean;
};

export default function Overlay({ children, isVisible }: Props) {
  return (
    <OverlayComponent className={isVisible ? 'visible' : ''}>
      {children}
    </OverlayComponent>
  );
}
