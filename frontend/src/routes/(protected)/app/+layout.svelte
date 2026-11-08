<script lang="ts">
  import { AppSidebar } from '#lib/features/app-shell/index.js';
  import * as Sidebar from '#lib/shared/ui/sidebar/index.js';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset class="bg-background">
    <main class="flex w-full flex-1 flex-col gap-8 px-4 py-6 sm:px-10 sm:py-8">
      {@render children()}
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>
