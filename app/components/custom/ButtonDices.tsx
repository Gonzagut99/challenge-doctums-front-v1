import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    children?: React.ReactNode;
    type?: "submit" | "reset" | "button";
    className?: string;
}

export function ButtonDices({ children, className, ...rest }: ButtonProps) {
    return (
        <button
        {...rest}
        className={twMerge(
          "relative w-60 h-16 flex items-center justify-center group overflow-hidden",
          className
        )}
      >
        {/* Imagen principal */}
        <img
          className="absolute inset-0 w-full h-full block group-hover:hidden"
          src="/assets/buttons/ButtonPurple.png"
          alt="Button"
        />
        {/* Imagen de hover */}
        <img
          className="absolute inset-0 w-full h-full hidden group-hover:block"
          src="/assets/buttons/ButtonPurple-hover.png"
          alt="Button Hover"
        />
        {/* Contenido del botón */}
        <p className="z-10 text-center">{children}</p>
      </button>
      
    );
  }