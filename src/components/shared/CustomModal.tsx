import { Dialog, Transition } from "@headlessui/react";
import { Fragment, type ReactNode, useRef } from "react";
import { useColorMode } from "../ui/color-mode";
import { Box, Text, IconButton } from "@chakra-ui/react";
import { X } from "lucide-react"; // أو استخدم أي icon

interface IProps {
  isOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function CustomModal({
  isOpen,
  closeModal,
  children,
  title,
  description,
}: IProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const closeButtonRef = useRef(null);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeModal}
          initialFocus={closeButtonRef}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`w-full max-w-md transform overflow-hidden rounded-md text-left align-middle shadow-xl transition-all ${
                    isDark ? "bg-[#111] text-white" : "bg-white text-black"
                  }`}
                  style={{ padding: "20px" }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={4}
                  >
                    <Text fontSize="lg" fontWeight="semibold">
                      {title}
                    </Text>
                    <IconButton
                      ref={closeButtonRef}
                      aria-label="Close modal"
                      size="sm"
                      variant="ghost"
                      onClick={closeModal}
                    >
                      <X size={18} />
                    </IconButton>
                  </Box>

                  {description && (
                    <Box mt={2} mb={4}>
                      <Text fontSize="sm" opacity={0.7}>
                        {description}
                      </Text>
                    </Box>
                  )}

                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
