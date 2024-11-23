import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { motion } from "framer-motion";
import { XButton } from './xButton'

import { registerHotkey, setHotkeysScope } from "~/utils/hotkeysHelpers";
import { BackButton } from "./BackButton";

export function useOutsideRefsClick(refs: React.RefObject<HTMLElement>[], callback: () => void) {
    useEffect(() => {
        function listener(e: Event) {
            const filteredRefs = refs.filter(
                (x) => !x.current || x.current.contains(e.target as Node)
            );

            if (filteredRefs.length === 0) {
                callback();
            }
        }

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [refs, callback]);
}

export default function Modal(
    props: React.PropsWithChildren<{
        title?: string;
        isDisabled?: boolean;
        type?: 'close' | 'back';
        onDismiss: () => void;
        className?: string;
    }>
) {
    const [isInitialized, setIsInitialized] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollbarWidth: number = window.innerWidth - document.body.offsetWidth;

        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        setIsInitialized(true);
        setHotkeysScope("modal");

        return () => {
            document.body.style.removeProperty("overflow");
            document.body.style.removeProperty("padding-right");
        };
    }, []);

    const { onDismiss, isDisabled, type = 'close' } = props;

    const handleOutsideClickOrDismissKeypress = useCallback(() => {
        if (isInitialized && !isDisabled) {
            onDismiss();
        }
    }, [onDismiss, isInitialized, isDisabled]);

    useOutsideRefsClick([modalRef], handleOutsideClickOrDismissKeypress);

    useEffect(() => {
        const { unbind } = registerHotkey("Esc", "modal", (e: KeyboardEvent) => {
            e.preventDefault();
            handleOutsideClickOrDismissKeypress();
        });

        return () => {
            unbind();
        };
    }, [handleOutsideClickOrDismissKeypress]);

    return (
        <>
            {isInitialized &&
                createPortal(
                    <>
                        {/* Overlay */}
                        <div className="fixed inset-0 z-30">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.75 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="absolute inset-0 bg-zinc-700"
                            />
                        </div>

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="fixed inset-0 z-40 flex items-center justify-center"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-title"
                        >
                            <article
                                ref={modalRef}
                                className="z-50 w-full overflow-hidden rounded text-zinc-900  max-w-screen-lg px-12 relative flex items-center"
                            >
                                <img src="/assets/frames/GameTabletFrame.png" alt="Tablet" className="w-[900px] min-w-[900px] absolute"/>
                                <section className="min-w-[900px] w-[900px] min-h-[660px] h-[660px] px-14 pt-8 pb-[3.6rem] shadow-md relative">
                                    <div className="py-4 px-2 h-full">
                                        <header className="flex justify-center ">
                                            <div className="w-full relative py-2 px-4 flex bg-zinc-50 rounded-md border-[3px] border-zinc-900">
                                                <p id="modal-title" className="text-center w-full font-dogica-bold">{props.title}</p>
                                                {
                                                    type === 'close' ? (
                                                        !isDisabled && (
                                                            <XButton className="size-8 absolute right-2 top-1" onClick={handleOutsideClickOrDismissKeypress}/>
                                                        )
                                                    ):(
                                                        !isDisabled && (
                                                            <BackButton className="size-8 absolute right-2 top-1" onClick={handleOutsideClickOrDismissKeypress}/>
                                                        )
                                                    )
                                                }
                                                
                                            </div>
                                        </header>
                                        <div className={props.className}>{props.children}</div>
                                    </div>
                                </section>
                            </article>
                        </motion.div>
                    </>,
                    document.getElementById("modal-container") as Element
                )}
        </>
    );
}
