import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  children?: React.ReactNode;
  type?: "submit" | "reset" | "button";
  className?: string;
}

export function ButtonSecondary({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={twMerge(
        "relative w-60 h-16 flex items-center justify-center group overflow-hidden",
        className
      )}
    >
      <img
        className="absolute inset-0 w-full h-full group-hover:opacity-0"
        src="/assets/buttons/ButtonSecondary.png"
        alt="Button"
      />
      <img
        className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100"
        src="/assets/buttons/ButtonSecondary-hover.png"
        alt="Button Hover"
      />
      <p className="z-10 text-center">{children}</p>
    </button>
  );
}