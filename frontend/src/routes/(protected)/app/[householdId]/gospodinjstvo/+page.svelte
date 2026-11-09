<script lang="ts">
  import UserPlusIcon from '@lucide/svelte/icons/user-plus';
  import { AppHeader } from '#lib/features/app-shell/index.js';
  import { HouseholdMembersCard, householdSummary } from '#lib/features/household/index.js';
  import {
    InviteMemberForm,
    PendingInvitationsCard,
  } from '#lib/features/household-invitation/index.js';
  import * as Card from '#lib/shared/ui/card/index.js';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const isOwner = $derived(data.household.role === 'OWNER');
</script>

<svelte:head>
  <title>Gospodinjstvo · {data.household.name} · Leftover</title>
</svelte:head>

<AppHeader
  title="Gospodinjstvo"
  description={`${data.household.name} · ${householdSummary(data.household.role, data.members.length)}`}
/>

<HouseholdMembersCard members={data.members} />

{#if isOwner}
  <div class="grid items-start gap-6 xl:grid-cols-2">
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

    <PendingInvitationsCard householdId={data.household.id} invitations={data.invitations} />
  </div>
{/if}
