import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    children?: React.ReactNode;
    type?: "submit" | "reset" | "button";
    className?: string;
}

export function ButtonSecondary ({ children, className, ...rest }:ButtonProps) {
    return (
        <button {...rest} className={twMerge("relative w-60 aspect-[4/1] aspect flex items-center justify-center", className)}>
            <img
                className="w-full absolute inset-0 h-full"
                src="/assets/buttons/ButtonSecondary.png"
                alt="Button"
            />
            <p className="z-10">
                {children}
            </p>
        </button>
    );
}
