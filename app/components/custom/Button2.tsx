import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  children?: React.ReactNode;
  type?: "submit" | "reset" | "button";
  className?: string;
  disabled?: boolean;
}

export function Button2({ children, className, disabled, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={twMerge(
        "relative w-60 h-16 flex items-center justify-center group overflow-hidden",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      <img
        className="absolute inset-0 w-full h-full group-hover:opacity-0"
        src="/assets/buttons/Button2.png"
        alt="Button"
      />
      <img
        className="absolute inset-0 w-full h-full opacity-0  group-hover:opacity-100"
        src="/assets/buttons/Button2-hover.png"
        alt="Button Hover"
      />
      <p className="z-10 text-center">{children}</p>
    </button>
  );
}
