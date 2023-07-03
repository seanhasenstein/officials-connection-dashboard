import Container from '../blocks/Container';
import Overlay from '../blocks/Overlay/Overlay';

type Props = {
  children: React.ReactNode;
  customContainerClass?: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Modal({
  children,
  customContainerClass,
  isVisible,
  setIsVisible,
}: Props) {
  return (
    <div>
      <Overlay isVisible={isVisible}>
        <Container
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          customContainerClass={customContainerClass ?? ''}
        >
          {children}
        </Container>
      </Overlay>
    </div>
  );
}
