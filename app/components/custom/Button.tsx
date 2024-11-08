import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    children?: React.ReactNode;
    type?: "submit" | "reset" | "button";
    className?: string;
}

export function Button ({ children, className, ...rest }:ButtonProps) {
    return (
        <button {...rest} className={twMerge("relative w-60 aspect-[16/5] aspect flex items-center justify-center", className)}>
            <img
                className="w-full absolute inset-0"
                src="/assets/buttons/Button.png"
                alt="Button"
            />
            <p className="z-10">
                {children}
            </p>
        </button>
    );
}
