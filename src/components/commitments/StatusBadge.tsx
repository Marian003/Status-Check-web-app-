import { getEffectiveStatus, STATUS_CONFIG } from "@/lib/status";
import type { EffectiveStatusInput } from "@/lib/status";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/** Read-only badge that always shows the derived effective status (incl. EXPIRED). */
export function StatusBadge({
  commitment,
  className,
}: {
  commitment: EffectiveStatusInput;
  className?: string;
}) {
  const status = getEffectiveStatus(commitment);
  const config = STATUS_CONFIG[status];

  return (
    <Badge className={cn("px-1.5 text-[11px]", config.badgeClassName, className)}>
      {config.label}
    </Badge>
  );
}
