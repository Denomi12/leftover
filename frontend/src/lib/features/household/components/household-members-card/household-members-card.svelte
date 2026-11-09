<script lang="ts">
  import { auth } from '#lib/features/auth/index.js';
  import { getInitials } from '#lib/shared/lib/initials.js';
  import * as Avatar from '#lib/shared/ui/avatar/index.js';
  import { Badge } from '#lib/shared/ui/badge/index.js';
  import * as Card from '#lib/shared/ui/card/index.js';
  import * as Item from '#lib/shared/ui/item/index.js';
  import { ROLE_LABELS } from '../../lib/household-labels.js';
  import type { HouseholdMember } from '../../types/household.js';

  let { members }: { members: HouseholdMember[] } = $props();
</script>

<Card.Root>
  <Card.Header>
    <Card.Title class="font-display text-lg font-normal tracking-[-0.02em]">
      Člani · {members.length}
    </Card.Title>
    <Card.Description
      >Vsi člani si delijo zalogo, načrt obrokov in nakupovalni seznam.</Card.Description
    >
  </Card.Header>
  <Card.Content>
    <Item.Group class="gap-0">
      {#each members as member, index (member.id)}
        {#if index > 0}
          <Item.Separator />
        {/if}
        <Item.Root class="px-0">
          <Item.Media>
            <Avatar.Root class="size-10 rounded-lg after:rounded-lg">
              <Avatar.Fallback
                class="rounded-lg bg-secondary text-sm font-medium text-secondary-foreground"
              >
                {getInitials(member.user.name)}
              </Avatar.Fallback>
            </Avatar.Root>
          </Item.Media>
          <Item.Content class="min-w-0">
            <Item.Title class="block truncate">
              {member.user.name}
              {#if member.user.id === auth.user?.id}
                <span class="font-normal text-muted-foreground">(ti)</span>
              {/if}
            </Item.Title>
            <Item.Description class="truncate">{member.user.email}</Item.Description>
          </Item.Content>
          <Item.Actions>
            <Badge variant={member.role === 'OWNER' ? 'default' : 'secondary'}>
              {ROLE_LABELS[member.role]}
            </Badge>
          </Item.Actions>
        </Item.Root>
      {/each}
    </Item.Group>
  </Card.Content>
</Card.Root>
