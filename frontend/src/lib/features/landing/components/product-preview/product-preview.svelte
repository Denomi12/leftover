<script lang="ts">
  import ArchiveIcon from '@lucide/svelte/icons/archive';
  import CalendarDaysIcon from '@lucide/svelte/icons/calendar-days';
  import ChartColumnIcon from '@lucide/svelte/icons/chart-column';
  import PlusIcon from '@lucide/svelte/icons/plus';
  import SearchIcon from '@lucide/svelte/icons/search';
  import ShoppingCartIcon from '@lucide/svelte/icons/shopping-cart';
  import UsersIcon from '@lucide/svelte/icons/users';
  import { Logo } from '#lib/shared/components/logo/index.js';
  import { Badge } from '#lib/shared/ui/badge/index.js';
  import { Button } from '#lib/shared/ui/button/index.js';
  import { Progress } from '#lib/shared/ui/progress/index.js';
  import { cn } from '#lib/shared/utils.js';

  let { class: className }: { class?: string } = $props();

  type Status = 'expired' | 'soon' | 'ok';

  const nav = [
    { label: 'Zaloga', icon: ArchiveIcon, active: true },
    { label: 'Načrt obrokov', icon: CalendarDaysIcon },
    { label: 'Nakupovalni seznam', icon: ShoppingCartIcon },
    { label: 'Statistika', icon: ChartColumnIcon },
    { label: 'Gospodinjstvo', icon: UsersIcon },
  ];

  const items: { name: string; amount: string; due: string; left: number; status: Status }[] = [
    { name: 'Jogurt', amount: '2 kos', due: 'včeraj', left: 100, status: 'expired' },
    { name: 'Piščančje prsi', amount: '500 g', due: 'jutri', left: 85, status: 'soon' },
    { name: 'Špinača', amount: '200 g', due: 'čez 2 dni', left: 70, status: 'soon' },
    { name: 'Mleko', amount: '1,5 l', due: 'čez 6 dni', left: 40, status: 'ok' },
    { name: 'Jajca', amount: '6 kos', due: 'čez 12 dni', left: 20, status: 'ok' },
  ];

  const statusLabel: Record<Status, string> = {
    expired: 'Poteklo',
    soon: 'Kmalu poteče',
    ok: 'V redu',
  };
</script>

<div
  aria-hidden="true"
  inert
  class={cn(
    'overflow-hidden rounded-xl border bg-card text-left shadow-[0_24px_60px_-30px_rgb(11_21_48/0.35)]',
    className,
  )}
>
  <div class="flex">
    <aside class="hidden w-52 shrink-0 flex-col gap-6 border-r p-4 md:flex">
      <Logo class="pl-1" />
      <nav class="flex flex-col gap-0.5 text-sm">
        {#each nav as item (item.label)}
          <span
            class={cn(
              'flex items-center gap-2 rounded-md p-2 [&_svg]:size-4',
              item.active ? 'font-medium text-primary' : 'text-muted-foreground',
            )}
          >
            <item.icon />
            {item.label}
          </span>
        {/each}
      </nav>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col gap-5 p-5 sm:p-6">
      <div class="flex items-start justify-between gap-4">
        <div class="flex flex-col gap-0.5">
          <span class="font-display text-xl tracking-[-0.02em] sm:text-2xl">Zaloga</span>
          <span class="text-sm text-muted-foreground">Stanovanje Kotnikova, 3 člani</span>
        </div>
        <Button size="sm" tabindex={-1}>
          <PlusIcon data-icon="inline-start" />
          Dodaj živilo
        </Button>
      </div>

      <div
        class="flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground"
      >
        <SearchIcon class="size-4" />
        Išči živilo
      </div>

      <div class="overflow-hidden rounded-lg border">
        <div
          class="grid grid-cols-[1fr_7.5rem] gap-4 border-b bg-muted/60 px-4 py-2.5 text-[13px] font-medium text-muted-foreground sm:grid-cols-[1.4fr_0.6fr_1fr_7.5rem]"
        >
          <span>Živilo</span>
          <span class="hidden sm:block">Količina</span>
          <span class="hidden sm:block">Rok uporabe</span>
          <span class="text-right">Stanje</span>
        </div>
        {#each items as item (item.name)}
          <div
            class="grid grid-cols-[1fr_7.5rem] items-center gap-4 border-b px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[1.4fr_0.6fr_1fr_7.5rem]"
          >
            <span class="font-medium">{item.name}</span>
            <span class="hidden text-muted-foreground sm:block">{item.amount}</span>
            <span class="hidden flex-col gap-1.5 sm:flex">
              <span class="text-muted-foreground">{item.due}</span>
              <Progress
                value={item.left}
                class={cn(
                  'h-1 w-28 bg-secondary',
                  item.status === 'expired' && '*:data-[slot=progress-indicator]:bg-brand-dark',
                  item.status === 'ok' && '*:data-[slot=progress-indicator]:bg-primary/40',
                )}
              />
            </span>
            <Badge
              variant={item.status === 'expired' ? 'default' : 'secondary'}
              class={cn(
                'justify-self-end rounded-full',
                item.status === 'expired' && 'bg-brand-dark',
                item.status === 'ok' && 'bg-muted text-muted-foreground',
              )}
            >
              {statusLabel[item.status]}
            </Badge>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
