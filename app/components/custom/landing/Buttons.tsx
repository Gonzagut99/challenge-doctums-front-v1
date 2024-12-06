import { buttonVariants } from "~/components/ui/button";
import { twMerge } from "tailwind-merge";

export function ButtonCeleste({ children }: { children: React.ReactNode }) {
    return (
      <button
      className={twMerge(buttonVariants({
        variant: "outline",
        className: "border-celeste border-[2.5px] w-full  my-2 py-4 md:py-5 px-2 md:px-4 min-w-80 md:min-w-64 md:max-w-80 text-black font-montserrat hover:bg-celeste hover:text-white",
      }))}
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
        className={twMerge(buttonVariants({
          variant: "outline",
          className: "relative border-[2.5px] w-full py-4 md:py-none md:py-5 px-2 md:px-4 min-w-80 md:min-w-64 md:max-w-80 border-yellowDark text-black font-montserrat hover:bg-yellowDark hover:text-white",
        }))}
      >
        <p className="text-sm md:text-lg font-semibold">
          {children}
        </p>
      </button>
    );
}

export function ButtonContact({ children }: { children: React.ReactNode }) {
  return (
    <button
      className={twMerge(buttonVariants({
        variant: "outline",
        className: "relative border-[2.5px] bg-yellowDark w-full py-4 md:py-none md:py-5 px-2 md:px-4 min-w-32 md:min-w-32 md:max-w-40 border-yellowDark text-black font-montserrat hover:bg-zinc-900 hover:text-white",
      }))}
    >
      <p className="text-md md:text-[16px] font-montserrat font-semibold">
        {children}
      </p>
    </button>
  );
}
