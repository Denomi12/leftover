<script lang="ts">
  import ArchiveIcon from '@lucide/svelte/icons/archive';
  import { AppHeader } from '#lib/features/app-shell/index.js';
  import { auth } from '#lib/features/auth/index.js';
  import * as Empty from '#lib/shared/ui/empty/index.js';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const firstName = $derived(auth.user?.name.trim().split(/\s+/)[0] ?? '');
</script>

<svelte:head>
  <title>Zaloga · {data.household.name} · Leftover</title>
</svelte:head>

<AppHeader
  title={`Zdravo, ${firstName}!`}
  description={`Zaloga gospodinjstva ${data.household.name}`}
/>

<Empty.Root class="border bg-card">
  <Empty.Header>
    <Empty.Media variant="icon" class="bg-secondary text-primary">
      <ArchiveIcon />
    </Empty.Media>
    <Empty.Title class="font-display text-xl font-normal tracking-[-0.02em]">
      Zaloga je še prazna
    </Empty.Title>
    <Empty.Description>
      Ko bodo v gospodinjstvu dodana prva živila, jih boš videl tukaj, razvrščena po roku uporabe.
    </Empty.Description>
  </Empty.Header>
</Empty.Root>
