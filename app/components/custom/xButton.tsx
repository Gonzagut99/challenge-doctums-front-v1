import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    type?: "submit" | "reset" | "button";
    className?: string;
}

export function XButton ({ className, ...rest }:ButtonProps) {
    return (
        <button {...rest} className={twMerge("relative w-7 aspect-square flex items-center justify-center", className)}>
            <img
                className="w-full absolute inset-0 h-full"
                src="/assets/buttons/xButton.png"
                alt="Button"
            />
        </button>
    );
}
