<script lang="ts">
  import { InvitationInbox } from '#lib/features/household-invitation/index.js';
  import * as Sidebar from '#lib/shared/ui/sidebar/index.js';
  import UserProfile from '../user-profile/user-profile.svelte';

  let { title, description }: { title: string; description?: string } = $props();
</script>

<header class="flex items-start justify-between gap-4">
  <div class="flex min-w-0 items-start gap-2">
    <Sidebar.Trigger class="mt-0.5 -ml-1 md:hidden" />
    <div class="flex min-w-0 flex-col gap-1">
      <h1 class="truncate font-display text-3xl font-normal tracking-[-0.03em]">{title}</h1>
      {#if description}
        <p class="text-base text-muted-foreground">{description}</p>
      {/if}
    </div>
  </div>
  <div class="flex shrink-0 items-center gap-3">
    <InvitationInbox />
    <UserProfile />
  </div>
</header>
