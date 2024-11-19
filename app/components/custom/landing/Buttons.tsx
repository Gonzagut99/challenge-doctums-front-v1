import { buttonVariants } from "~/components/ui/button";

export function ButtonCeleste({ children }: { children: React.ReactNode }) {
    return (
      <button
        className={buttonVariants({
          variant: "outline",
          className: "border-[3px] py-5 px-4 min-w-64 border-celeste text-black font-montserrat hover:bg-celeste hover:text-white",
        })}
      >
        <p className="text-md md:text-lg font-semibold">
        {children}
        </p>
      </button>
    );
  }


export function ButtonYellow({ children }: { children: React.ReactNode }) {
    return (
      <button
        className={buttonVariants({
          variant: "outline",
          className: "border-[3px] py-5 min-w-64  border-yellowDark text-black font-montserrat hover:bg-yellowDark hover:text-white",
        })}
      >
        <p className="text-md md:text-lg font-semibold">
        {children}
        </p>
      </button>
    );
  }
