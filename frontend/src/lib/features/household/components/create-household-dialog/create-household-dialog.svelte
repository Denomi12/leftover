<script lang="ts">
  import * as Dialog from '#lib/shared/ui/dialog/index.js';
  import CreateHouseholdForm from '../create-household-form/create-household-form.svelte';

  let { open = $bindable(false) }: { open?: boolean } = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>Novo gospodinjstvo</Dialog.Title>
      <Dialog.Description>
        Ko ga ustvariš, postaneš njegov lastnik in vanj kasneje povabiš ostale.
      </Dialog.Description>
    </Dialog.Header>
    {#if open}
      <CreateHouseholdForm id="dialog-household-name" onCreated={() => (open = false)} />
    {/if}
  </Dialog.Content>
</Dialog.Root>
