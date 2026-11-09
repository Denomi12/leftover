<script lang="ts">
  import UserPlusIcon from '@lucide/svelte/icons/user-plus';
  import UsersIcon from '@lucide/svelte/icons/users';
  import { AppHeader } from '#lib/features/app-shell/index.js';
  import { householdSummary } from '#lib/features/household/index.js';
  import {
    InviteMemberForm,
    PendingInvitationsCard,
  } from '#lib/features/household-invitation/index.js';
  import * as Card from '#lib/shared/ui/card/index.js';
  import * as Empty from '#lib/shared/ui/empty/index.js';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const isOwner = $derived(data.household.role === 'OWNER');
</script>

<svelte:head>
  <title>Gospodinjstvo · {data.household.name} · Leftover</title>
</svelte:head>

<AppHeader
  title="Gospodinjstvo"
  description={`${data.household.name} · ${householdSummary(data.household.role, data.household.memberCount)}`}
/>

{#if isOwner}
  <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
    <Card.Root>
      <Card.Header>
        <div class="flex items-start gap-3">
          <span
            class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary"
          >
            <UserPlusIcon class="size-4" />
          </span>
          <div class="flex flex-col gap-1">
            <Card.Title class="font-display text-lg font-normal tracking-[-0.02em]">
              Povabi v gospodinjstvo
            </Card.Title>
            <Card.Description>
              Povabljeni dobi obvestilo v aplikaciji in povabilo sprejme ali zavrne.
            </Card.Description>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <InviteMemberForm householdId={data.household.id} />
      </Card.Content>
    </Card.Root>

    <PendingInvitationsCard invitations={data.invitations} />
  </div>
{:else}
  <Empty.Root class="border bg-card">
    <Empty.Header>
      <Empty.Media variant="icon" class="bg-secondary text-primary">
        <UsersIcon />
      </Empty.Media>
      <Empty.Title class="font-display text-xl font-normal tracking-[-0.02em]">
        Člane vabi lastnik
      </Empty.Title>
      <Empty.Description>
        V gospodinjstvu {data.household.name} lahko nove člane vabi in jim določa vloge samo lastnik.
      </Empty.Description>
    </Empty.Header>
  </Empty.Root>
{/if}
