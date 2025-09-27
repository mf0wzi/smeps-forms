"use client";

import type { IconId } from "@/lib/nav/icon-ids";
import {
  IconDashboard, IconListDetails, IconChartBar, IconFolder, IconUsers,
  IconSettings, IconHelp, IconSearch, IconDatabase, IconReport, IconFileWord,
} from "@tabler/icons-react";

const iconMap: Record<IconId, React.ComponentType<React.ComponentProps<typeof IconDashboard>>> = {
  dashboard: IconDashboard,
  forms: IconListDetails,
  analytics: IconChartBar,
  projects: IconFolder,
  users: IconUsers,
  settings: IconSettings,
  help: IconHelp,
  search: IconSearch,
  database: IconDatabase,
  report: IconReport,
  word: IconFileWord,
};

type IconProps = React.ComponentProps<typeof IconDashboard>;

export function NavIcon({
  id,
  className,
  ...props
}: { id?: IconId; className?: string } & Omit<IconProps, "className">) {
  if (!id) return null;
  const Cmp = iconMap[id];
  return Cmp ? <Cmp className={className} {...props} /> : null;
}
