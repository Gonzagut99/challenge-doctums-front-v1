import { twMerge } from "tailwind-merge"

interface BudgetButtonProps extends React.HTMLProps<HTMLButtonElement> {
    alreadyAcquired: boolean, 
    product: { id: string, cost: number }, 
    handleSelectProduct: (id: string) => void 
    className?: string
    modifierType?: "products" | "resources" | "projects" | undefined
}    
export function CostButton({ alreadyAcquired, product, handleSelectProduct, className, modifierType }: BudgetButtonProps) {
    const alreadyAcquiredProductText = alreadyAcquired ? "Ya tienes este producto" : "Aún no tienes este producto"
    const alreadyAcquiredResourceText = alreadyAcquired ? "Ya contrataste este recurso" : "Aún no contrataste este recurso"
    const alreadyAcquiredProjectText = alreadyAcquired ? "Ya ejecutaste este proyecto" : "Aún no has ejecutado este proyecto"
    let alreadyAquiredText = ""
    switch (modifierType) {
        case "products":
            alreadyAquiredText = alreadyAcquiredProductText
            break
        case "resources":
            alreadyAquiredText = alreadyAcquiredResourceText
            break
        case "projects":
            alreadyAquiredText = alreadyAcquiredProjectText
            break
        default:
            alreadyAquiredText = alreadyAcquiredProductText
            break
    }
  return (
    <button
    className={twMerge("flex items-center gap-2 border-2 border-zinc-900 bg-[#99C579] px-2 disabled:opacity-50 hover:scale-105 transform transition-transform duration-300", className)}
    onClick={() => handleSelectProduct(product.id)}
    disabled={alreadyAcquired}
    title={
        alreadyAquiredText
        }
    >
        <figure className={"px-1 h-full flex items-center w-fit"}>
            <img src="/assets/icons/cashIcon.png" alt="Icon" className="size-6" />
        </figure>
        <span className="font-easvhs text-lg">{product.cost}</span>
    </button>
  )
}
