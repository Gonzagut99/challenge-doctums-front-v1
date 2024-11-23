import { twMerge } from "tailwind-merge";

interface WhiteContainerProps extends React.HTMLProps<HTMLDivElement> {
    children?: React.ReactNode;
    className?: string;
}

export function WhiteContainer({ children, className, ...rest }: WhiteContainerProps) {
  return (
    <div {...rest} className={twMerge("relative", className)}>
        <img src="/assets/components/WhiteContainer.png" alt="Container" className="absolute object-fill w-full h-full"/>
        <div className="relative w-full h-full px-2 py-2">
            {children}
        </div>
    </div>
  )
}

export function WhiteContainerLarge({ children, className, ...rest }: WhiteContainerProps) {
  return (
    <div {...rest} className={twMerge("relative", className)}>
        <img src="/assets/components/WhiteContainerLarge.png" alt="Container" className="absolute object-fill w-full h-full"/>
        <div className="relative w-full h-full px-2 py-2">
            {children}
        </div>
    </div>
  )
}
