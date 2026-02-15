import { Skeleton } from '@/components/ui/skeleton'

export default function KnowledgeLoading() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="border-b px-6 py-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="border-b px-6 py-2">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-8 w-36" />
        </div>
      </div>
      <div className="flex-1 space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    </div>
  )
}
