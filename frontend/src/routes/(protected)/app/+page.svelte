<script lang="ts">
  import ArchiveIcon from '@lucide/svelte/icons/archive';
  import { AppHeader } from '#lib/features/app-shell/index.js';
  import { auth } from '#lib/features/auth/index.js';
  import * as Card from '#lib/shared/ui/card/index.js';

  const firstName = $derived(auth.user?.name.trim().split(/\s+/)[0] ?? '');
</script>

<svelte:head>
  <title>Zaloga · Leftover</title>
</svelte:head>

<AppHeader title={`Zdravo, ${firstName}!`} description="Pregled zaloge tvojega gospodinjstva" />

<Card.Root class="shadow-none">
  <Card.Content class="flex flex-col items-center gap-4 py-14 text-center">
    <span
      class="flex size-14 items-center justify-center rounded-xl bg-secondary text-primary [&_svg]:size-6"
    >
      <ArchiveIcon />
    </span>
    <div class="flex max-w-sm flex-col gap-1.5">
      <h2 class="font-display text-xl font-normal tracking-[-0.02em]">Zaloga je še prazna</h2>
      <p class="text-sm text-muted-foreground">
        Ko bodo v gospodinjstvu dodana prva živila, jih boš videl tukaj, razvrščena po roku uporabe.
      </p>
    </div>
  </Card.Content>
</Card.Root>
