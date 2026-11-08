<script lang="ts">
  import { page } from '$app/state';
  import HouseIcon from '@lucide/svelte/icons/house';
  import { Button } from '#lib/shared/ui/button/index.js';
  import * as Empty from '#lib/shared/ui/empty/index.js';
</script>

<svelte:head>
  <title>Gospodinjstvo ni dostopno · Leftover</title>
</svelte:head>

<Empty.Root class="border bg-card">
  <Empty.Header>
    <Empty.Media variant="icon" class="bg-secondary text-primary">
      <HouseIcon />
    </Empty.Media>
    <Empty.Title class="font-display text-xl font-normal tracking-[-0.02em]">
      {page.status === 404 ? 'Gospodinjstvo ni dostopno' : 'Prišlo je do napake'}
    </Empty.Title>
    <Empty.Description>{page.error?.message ?? 'Poskusi znova.'}</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button href="/app" variant="outline">Nazaj na moja gospodinjstva</Button>
  </Empty.Content>
</Empty.Root>
