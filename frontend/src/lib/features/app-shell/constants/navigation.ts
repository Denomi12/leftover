import type { Component } from 'svelte';
import ArchiveIcon from '@lucide/svelte/icons/archive';
import CalendarDaysIcon from '@lucide/svelte/icons/calendar-days';
import ChartColumnIcon from '@lucide/svelte/icons/chart-column';
import HistoryIcon from '@lucide/svelte/icons/history';
import ShoppingCartIcon from '@lucide/svelte/icons/shopping-cart';
import UsersIcon from '@lucide/svelte/icons/users';

export interface NavItem {
  label: string;
  icon: Component;
  path?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Zaloga', icon: ArchiveIcon, path: '' },
  { label: 'Načrt obrokov', icon: CalendarDaysIcon },
  { label: 'Nakupovalni seznam', icon: ShoppingCartIcon },
  { label: 'Statistika', icon: ChartColumnIcon },
  { label: 'Zgodovina', icon: HistoryIcon },
  { label: 'Gospodinjstvo', icon: UsersIcon, path: '/gospodinjstvo' },
];
