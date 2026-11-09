<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { AppSidebar } from '#lib/features/app-shell/index.js';
  import { invitationInbox } from '#lib/features/household-invitation/index.js';
  import * as Sidebar from '#lib/shared/ui/sidebar/index.js';
  import type { LayoutProps } from './$types';

  let { data, children }: LayoutProps = $props();

  onMount(() => invitationInbox.start());

  const activeHouseholdId = $derived(
    data.households.find(({ id }) => id === page.params.householdId)?.id,
  );
</script>

<Sidebar.Provider>
  <AppSidebar households={data.households} {activeHouseholdId} />
  <Sidebar.Inset class="bg-background">
    <main class="flex w-full flex-1 flex-col gap-8 px-4 py-6 sm:px-10 sm:py-8">
      {@render children()}
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>
