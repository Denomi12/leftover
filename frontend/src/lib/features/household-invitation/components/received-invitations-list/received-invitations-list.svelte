<script lang="ts">
  import { invitationInbox } from '../../stores/invitation-inbox.svelte.js';
  import ReceivedInvitationItem from '../received-invitation-item/received-invitation-item.svelte';
</script>

{#if invitationInbox.items.length}
  <section class="flex flex-col gap-3" aria-labelledby="received-invitations-title">
    <h2 id="received-invitations-title" class="text-sm font-medium text-muted-foreground">
      Povabila v gospodinjstva
    </h2>
    <div class="grid gap-3 sm:grid-cols-2">
      {#each invitationInbox.items as invitation (invitation.id)}
        <ReceivedInvitationItem {invitation} variant="outline" class="bg-card p-4" />
      {/each}
    </div>
  </section>
{/if}
