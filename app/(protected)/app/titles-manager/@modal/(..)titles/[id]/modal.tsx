'use client';

import { type ElementRef, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import "@/app/globals.css"
import styles from "@/app/(protected)/app/titles-manager/titlesManager.module.css";

export function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dialogRef = useRef<ElementRef<'dialog'>>(null);

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
            document.querySelector('body')?.classList.add('modal-open');
        }
        console.log('efw')
    }, []);

    function onDismiss() {
        document.querySelector('body')?.classList.remove('modal-open');
        router.back();
    }

    return createPortal(
        <div className={styles.modal_backdrop}>
            <dialog ref={dialogRef} className="modal" onClose={onDismiss}>
                {children}
                <button onClick={onDismiss} className={styles.close_button} >truc</button>
            </dialog>
        </div>,
        document.getElementById('modal-root')!
    );
}
