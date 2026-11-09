<script lang="ts">
  import HouseIcon from '@lucide/svelte/icons/house';
  import { AppHeader } from '#lib/features/app-shell/index.js';
  import { auth } from '#lib/features/auth/index.js';
  import { CreateHouseholdForm } from '#lib/features/household/index.js';
  import { ReceivedInvitationsList } from '#lib/features/household-invitation/index.js';
  import * as Empty from '#lib/shared/ui/empty/index.js';

  const firstName = $derived(auth.user?.name.trim().split(/\s+/)[0] ?? '');
</script>

<svelte:head>
  <title>Gospodinjstva · Leftover</title>
</svelte:head>

<AppHeader title={`Zdravo, ${firstName}!`} description="Še nisi član nobenega gospodinjstva" />

<ReceivedInvitationsList />

<Empty.Root class="border bg-card">
  <Empty.Header>
    <Empty.Media variant="icon" class="bg-secondary text-primary">
      <HouseIcon />
    </Empty.Media>
    <Empty.Title class="font-display text-xl font-normal tracking-[-0.02em]">
      Pridruži se ali ustvari svoje
    </Empty.Title>
    <Empty.Description>
      Če te lastnik povabi v svoje gospodinjstvo, se bo pojavilo tukaj. Lahko pa ustvariš svoje in v
      njem postaneš lastnik.
    </Empty.Description>
  </Empty.Header>
  <Empty.Content class="w-full max-w-sm text-left">
    <CreateHouseholdForm />
  </Empty.Content>
</Empty.Root>
