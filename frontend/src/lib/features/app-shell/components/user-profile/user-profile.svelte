<script lang="ts">
  import { auth } from '#lib/features/auth/index.js';
  import * as Avatar from '#lib/shared/ui/avatar/index.js';

  const initials = $derived(
    (auth.user?.name ?? '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join(''),
  );
</script>

<div class="flex items-center gap-2.5">
  <Avatar.Root class="rounded-lg after:rounded-lg">
    <Avatar.Fallback class="rounded-lg bg-secondary text-xs font-medium text-secondary-foreground">
      {initials}
    </Avatar.Fallback>
  </Avatar.Root>
  <div class="hidden min-w-0 flex-col leading-tight sm:flex">
    <span class="truncate text-sm font-medium">{auth.user?.name}</span>
    <span class="truncate text-xs text-muted-foreground">{auth.user?.email}</span>
  </div>
</div>
