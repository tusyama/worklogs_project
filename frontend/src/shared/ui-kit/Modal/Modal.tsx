import { UI_TEXT } from "@worklog/shared";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button";
import { Text } from "../Text";
import { Body, Content, Footer, Header, Overlay } from "./Modal.styles";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type ModalRootProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  titleId?: string;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
};

function Root({
  open,
  onClose,
  children,
  titleId,
  closeOnEscape = true,
  closeOnOverlayClick = true,
}: ModalRootProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFirst = () => {
      const focusable = contentRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      focusable?.[0]?.focus();
    };
    focusFirst();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !contentRef.current) return;

      const focusable = Array.from(contentRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [open, onClose, closeOnEscape]);

  if (!open) return null;

  return createPortal(
    <Overlay
      role="presentation"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <Content
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </Content>
    </Overlay>,
    document.body,
  );
}

function ModalHeader({ children }: { children: ReactNode }) {
  return <Header>{children}</Header>;
}

function Title({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <Text as="h2" variant="title" id={id}>
      {children}
    </Text>
  );
}

function ModalBody({ children }: { children: ReactNode }) {
  return <Body>{children}</Body>;
}

function ModalFooter({ children }: { children: ReactNode }) {
  return <Footer>{children}</Footer>;
}

function Close({
  onClick,
  label = UI_TEXT.a11y.close,
  disabled,
}: {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <Button
      $variant="ghost"
      $size="sm"
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
    >
      ×
    </Button>
  );
}

export const Modal = {
  Root,
  Header: ModalHeader,
  Title,
  Body: ModalBody,
  Footer: ModalFooter,
  Close,
};
