import { Skeleton } from '@/components/ui/skeleton'

export default function ClientRoadmapLoading() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="flex flex-1 flex-col gap-4 border-r p-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="flex gap-4 py-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
      <div className="hidden w-2/5 flex-col gap-4 p-4 lg:flex">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}
