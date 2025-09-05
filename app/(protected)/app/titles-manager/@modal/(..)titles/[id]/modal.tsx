"use client";

import "@/app/globals.css";
import titleModalStyles from "@/app/styles/titles-manager/titlesManagerTitleModal.module.css";
import { useRouter } from "next/navigation";
import { type ElementRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Renders a modal component portal, that can wrap the candidate components :
 * (overlayTitleModal, standaloneTitleModal)
 *
 * @param children - The content to be displayed within the modal.
 * @returns The JSX element representing the modal.
 */
export function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dialogRef = useRef<ElementRef<"dialog">>(null);

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
            document.querySelector("body")?.classList.add("modal-open");
        }
    }, []);

    function onDismiss() {
        document.querySelector("body")?.classList.remove("modal-open");
        router.back();
    }

    return createPortal(
        <div className={titleModalStyles["modal-backdrop"]}>
            <dialog ref={dialogRef} className="modal" onClose={onDismiss}>
                {children}
                <button
                    onClick={onDismiss}
                    className={titleModalStyles.closeButton}
                >
                    truc
                </button>
            </dialog>
        </div>,
        document.getElementById("modal-root")!,
    );
}
