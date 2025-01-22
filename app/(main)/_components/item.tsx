"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useMutation } from "convex/react"
import { ChevronDown, ChevronRight, LucideIcon, Plus } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ItemProps {
    id?:Id<"documents">
    documentIcon?:string
    active?:boolean
    expanded?:boolean
    isSearch?:boolean
    level?:number
    onExpand?:() => void
    label:string
    onClick?:() => void
    icon:LucideIcon
}

export const Item = ({
    id,
    label,
    onClick,
    icon:Icon,
    active,
    documentIcon,
    isSearch,
    level=0,
    onExpand,expanded
}:ItemProps) => {
    const create = useMutation(api.documents.create)
    const router = useRouter()

    const handleExpand = (event:React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        onExpand?.()
    }

    const onCreate = (event:React.MouseEvent<HTMLDivElement,MouseEvent>) => {
        event.stopPropagation()
        if (!id) return
        const promise = create({title:"Untitled",parentDocument:id})
        .then((documentId) => {
          if (!expanded) {
            onExpand?.()
          }
        })
    
        toast.promise(promise,{
          loading:'Creating a new note...',
          success:'New note created!',
          error:'Failed to create a new note'
        })
      }

    const ChevronIcon = expanded ? ChevronDown : ChevronRight

    return (
        <div 
            onClick={onClick} 
            role="button" 
            style={{paddingLeft:level ? `${(level * 12) + 12}px` :'12px'}}
            className={cn(`group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5
                flex items-center text-muted-foreground font-medium`,
                active && 'bg-primary/5 text-primary')}
        >
            {!!id && (
                <div className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1" onClick={handleExpand} role="button">
                    <ChevronIcon className="w-4 h-4 shrink-0 text-muted-foreground/50"/>
                </div>
            )}

            {documentIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">
                {documentIcon}
                </div>
            ) :
                <Icon className="shrink-0 w-[18px] h-[18px] mr-2 text-muted-foreground"/>
            }

            <span>
                {label}
            </span>

            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex gap-1 items-center h-5 select-none rounded border
                bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
                </kbd>
            )}
            <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
            role="button" onClick={onCreate}>
                <Plus className="w-4 h-4 text-muted-foreground"/>
            </div>
        </div>
    )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
    return (
        <div className="flex gap-x-2 py-[3px]" style={{paddingLeft:level ? `${(level * 12) + 25}px`: '12px'}}>
            <Skeleton className="w-4 h-4"/>
            <Skeleton className="w-4 h-[30%]"/>
        </div>
    )
}