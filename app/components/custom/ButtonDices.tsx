import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    children?: React.ReactNode;
    type?: "submit" | "reset" | "button";
    className?: string;
}

export function ButtonDices ({ children, className, ...rest }:ButtonProps) {
    return (
        <button {...rest} className={twMerge("relative w-60 aspect-[4/1] aspect flex items-center justify-center", className)}>
            <img
                className="w-full absolute inset-0 h-full"
                src="/assets/buttons/ButtonPurple.png"
                alt="Button"
            />
            <p className="z-10">
                {children}
            </p>
        </button>
    );
}
