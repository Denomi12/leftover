<script lang="ts">
  import MailIcon from '@lucide/svelte/icons/mail';
  import { ROLE_LABELS } from '#lib/features/household/index.js';
  import { getInitials } from '#lib/shared/lib/initials.js';
  import * as Avatar from '#lib/shared/ui/avatar/index.js';
  import { Badge } from '#lib/shared/ui/badge/index.js';
  import * as Card from '#lib/shared/ui/card/index.js';
  import * as Empty from '#lib/shared/ui/empty/index.js';
  import * as Item from '#lib/shared/ui/item/index.js';
  import { formatSentAt } from '../../lib/invitation-labels.js';
  import type { HouseholdInvitation } from '../../types/household-invitation.js';

  let { invitations }: { invitations: HouseholdInvitation[] } = $props();
</script>

<Card.Root>
  <Card.Header>
    <Card.Title class="font-display text-lg font-normal tracking-[-0.02em]">
      Čakajoča povabila · {invitations.length}
    </Card.Title>
    <Card.Description>Ko povabljeni sprejme povabilo, postane član gospodinjstva.</Card.Description>
  </Card.Header>
  <Card.Content>
    {#if invitations.length}
      <Item.Group class="gap-0">
        {#each invitations as invitation, index (invitation.id)}
          {#if index > 0}
            <Item.Separator />
          {/if}
          <Item.Root class="px-0">
            <Item.Media>
              <Avatar.Root class="size-10 rounded-lg after:rounded-lg">
                <Avatar.Fallback
                  class="rounded-lg bg-secondary text-sm font-medium text-secondary-foreground"
                >
                  {getInitials(invitation.invitedUser.name)}
                </Avatar.Fallback>
              </Avatar.Root>
            </Item.Media>
            <Item.Content class="min-w-0">
              <Item.Title class="block truncate">{invitation.invitedUser.name}</Item.Title>
              <Item.Description class="truncate">{invitation.invitedUser.email}</Item.Description>
            </Item.Content>
            <Item.Actions class="flex-col items-end gap-1">
              <Badge variant="secondary">{ROLE_LABELS[invitation.role]}</Badge>
              <span class="text-xs text-muted-foreground">
                Poslano {formatSentAt(invitation.createdAt)}
              </span>
            </Item.Actions>
          </Item.Root>
        {/each}
      </Item.Group>
    {:else}
      <Empty.Root class="gap-3 rounded-lg border border-dashed p-6 md:p-6">
        <Empty.Header>
          <Empty.Media variant="icon" class="bg-secondary text-primary">
            <MailIcon />
          </Empty.Media>
          <Empty.Title class="text-base">Ni čakajočih povabil</Empty.Title>
          <Empty.Description>Povabljeni bodo tukaj, dokler povabila ne sprejmejo.</Empty.Description
          >
        </Empty.Header>
      </Empty.Root>
    {/if}
  </Card.Content>
</Card.Root>
