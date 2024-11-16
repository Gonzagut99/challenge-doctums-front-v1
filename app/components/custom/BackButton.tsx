import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    type?: "submit" | "reset" | "button";
    className?: string;
}

export function BackButton({ className, ...rest }:ButtonProps) {
    return (
        <button {...rest} className={twMerge("relative w-7 aspect-square flex items-center justify-center", className)}>
            <img
                src="/assets/buttons/BackButton.png"
                alt="Back Button"
                className="w-full absolute inset-0 h-full"
            />
        </button>
    );
}
