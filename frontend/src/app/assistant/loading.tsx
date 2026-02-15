import { Skeleton } from '@/components/ui/skeleton'

export default function AssistantLoading() {
  return (
    <div className="flex h-screen">
      {/* Sidebar skeleton */}
      <div className="w-72 border-r p-4">
        <Skeleton className="mb-4 h-8 w-full" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      </div>
      {/* Chat skeleton */}
      <div className="flex flex-1 flex-col">
        <div className="border-b p-4">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex-1 space-y-4 p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <Skeleton className="h-16 w-3/4 rounded-lg" />
            </div>
          ))}
        </div>
        <div className="border-t p-4">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
