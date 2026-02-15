import { Skeleton } from '@/components/ui/skeleton'

export default function OnboardingLoading() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="border-b px-6 py-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="px-6 py-3">
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="flex-1 space-y-4 p-4">
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="ml-auto h-12 w-1/2" />
        <Skeleton className="h-16 w-3/4" />
      </div>
      <div className="border-t p-4">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
