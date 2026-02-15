const statuses = [
  { label: 'Uploaded', color: 'bg-blue-500' },
  { label: 'Under Review', color: 'bg-yellow-500' },
  { label: 'Approved', color: 'bg-green-500' },
  { label: 'Rejected', color: 'bg-red-500' },
] as const

export function StatusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t px-4 py-2">
      {statuses.map((s) => (
        <div key={s.label} className="flex items-center gap-1.5">
          <span className={`h-2 w-2 shrink-0 rounded-full ${s.color}`} />
          <span className="text-muted-foreground text-[11px]">{s.label}</span>
        </div>
      ))}
    </div>
  )
}
