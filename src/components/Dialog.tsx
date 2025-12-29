import {
  Button,
  CloseButton,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

interface IProps {
  title?: string | ReactNode;
  description?: string;
  onClick: () => void;
  value: string | ReactNode;
  isLoading?: boolean;
  children?: ReactNode;
}

const ChakraDialog = ({ title, description, onClick, value, isLoading, children }: IProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild w={"100%"} _hover={{ bg: "red.500" }}>
        <Button variant="outline" size="sm" border={"1px solid #ccc"}>
          {value}
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner px={"30px"} zIndex={"999999"}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>{description}</p>
              {children}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button
                onClick={onClick}
                _hover={{ bg: "red.500" }}
                bg={"red.400"}
                loading={isLoading}
                loadingText="Loading..."
              >
                {value}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ChakraDialog;
