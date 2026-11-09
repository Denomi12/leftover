<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { Command as CommandPrimitive } from 'bits-ui';
  import SearchIcon from '@lucide/svelte/icons/search';
  import XIcon from '@lucide/svelte/icons/x';
  import { toast } from 'svelte-sonner';
  import { getInitials } from '#lib/shared/lib/initials.js';
  import * as Avatar from '#lib/shared/ui/avatar/index.js';
  import { Button } from '#lib/shared/ui/button/index.js';
  import * as Command from '#lib/shared/ui/command/index.js';
  import * as Field from '#lib/shared/ui/field/index.js';
  import * as InputGroup from '#lib/shared/ui/input-group/index.js';
  import * as Item from '#lib/shared/ui/item/index.js';
  import * as RadioGroup from '#lib/shared/ui/radio-group/index.js';
  import { Spinner } from '#lib/shared/ui/spinner/index.js';
  import { householdInvitationApi } from '../../api/household-invitation.api.js';
  import { mapInviteError } from '../../api/household-invitation-errors.js';
  import { HOUSEHOLD_INVITATIONS_DEPENDENCY } from '../../lib/household-invitation-routes.js';
  import { INVITABLE_ROLE_OPTIONS } from '../../lib/invitation-labels.js';
  import type { InvitableRole, InvitationUser } from '../../types/household-invitation.js';
  import {
    inviteMemberSchema,
    USER_SEARCH_MIN_LENGTH,
  } from '../../validations/household-invitation.js';

  const SEARCH_DEBOUNCE_MS = 250;

  let { householdId }: { householdId: string } = $props();

  let query = $state('');
  let selected = $state<InvitationUser | null>(null);
  let role = $state<InvitableRole>('MEMBER');
  let results = $state<InvitationUser[]>([]);
  let searching = $state(false);
  let listOpen = $state(false);
  let highlighted = $state('');
  let inputRef = $state<HTMLInputElement | null>(null);

  let submitted = $state(false);
  let isSubmitting = $state(false);
  let emailServerError = $state<string | null>(null);
  let formError = $state<string | null>(null);

  const term = $derived(query.trim());
  const showList = $derived(listOpen && !selected && term.length >= USER_SEARCH_MIN_LENGTH);
  const result = $derived(inviteMemberSchema.safeParse({ email: selected?.email ?? query, role }));
  const emailError = $derived(
    emailServerError ??
      (submitted && !result.success
        ? result.error.issues.find((issue) => issue.path[0] === 'email')?.message
        : undefined),
  );

  $effect(() => {
    const search = term;
    if (selected || search.length < USER_SEARCH_MIN_LENGTH) {
      results = [];
      searching = false;
      return;
    }

    searching = true;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        results = await householdInvitationApi.searchUsers(householdId, search, controller.signal);
      } catch {
        if (!controller.signal.aborted) results = [];
      } finally {
        if (!controller.signal.aborted) searching = false;
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  });

  function select(user: InvitationUser) {
    selected = user;
    query = user.email;
    listOpen = false;
    emailServerError = null;
  }

  function clearSelection() {
    selected = null;
    query = '';
    emailServerError = null;
    requestAnimationFrame(() => inputRef?.focus());
  }

  function onQueryInput() {
    listOpen = true;
    emailServerError = null;
  }

  function onSearchFocusOut(event: FocusEvent) {
    const target = event.currentTarget as HTMLElement;
    if (!target.contains(event.relatedTarget as Node | null)) listOpen = false;
  }

  function onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && showList) {
      event.preventDefault();
      listOpen = false;
    }
    if (event.key === 'Enter' && (!showList || results.length === 0)) {
      event.preventDefault();
      listOpen = false;
      (event.currentTarget as HTMLElement).closest('form')?.requestSubmit();
    }
  }

  async function onsubmit(event: SubmitEvent) {
    event.preventDefault();
    submitted = true;
    formError = null;
    emailServerError = null;
    if (!result.success) return;

    isSubmitting = true;
    try {
      const invitation = await householdInvitationApi.create(householdId, result.data);
      await invalidate(HOUSEHOLD_INVITATIONS_DEPENDENCY);
      toast.success(`Povabilo je poslano uporabniku ${invitation.invitedUser.name}.`);
      selected = null;
      query = '';
      submitted = false;
    } catch (error) {
      const { field, message } = mapInviteError(error);
      if (field === 'email') emailServerError = message;
      else formError = message;
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form {onsubmit} class="flex flex-col gap-6" novalidate>
  <Field.Field data-invalid={!!emailError}>
    <Field.Label for="invite-user">Uporabnik</Field.Label>
    {#if selected}
      <Item.Root variant="outline" size="sm" class="h-auto py-2">
        <Item.Media>
          <Avatar.Root class="size-8 rounded-lg after:rounded-lg">
            <Avatar.Fallback
              class="rounded-lg bg-secondary text-xs font-medium text-secondary-foreground"
            >
              {getInitials(selected.name)}
            </Avatar.Fallback>
          </Avatar.Root>
        </Item.Media>
        <Item.Content class="min-w-0 gap-0">
          <Item.Title class="block truncate">{selected.name}</Item.Title>
          <Item.Description class="truncate text-xs">{selected.email}</Item.Description>
        </Item.Content>
        <Item.Actions>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Izberi drugega uporabnika"
            onclick={clearSelection}
          >
            <XIcon />
          </Button>
        </Item.Actions>
      </Item.Root>
    {:else}
      <Command.Root
        shouldFilter={false}
        bind:value={highlighted}
        class="relative overflow-visible rounded-none! bg-transparent p-0"
        onfocusout={onSearchFocusOut}
        onfocusin={() => (listOpen = true)}
        oninput={onQueryInput}
      >
        <InputGroup.Root onkeydown={onSearchKeydown}>
          <InputGroup.Addon>
            <SearchIcon class="text-muted-foreground" />
          </InputGroup.Addon>
          <CommandPrimitive.Input value={query}>
            {#snippet child({ props })}
              <InputGroup.Input
                {...props}
                bind:value={query}
                id="invite-user"
                bind:ref={inputRef}
                autocomplete="off"
                placeholder="Ime ali e-naslov"
                aria-invalid={!!emailError}
              />
            {/snippet}
          </CommandPrimitive.Input>
          {#if searching}
            <InputGroup.Addon align="inline-end">
              <Spinner class="text-muted-foreground" />
            </InputGroup.Addon>
          {/if}
        </InputGroup.Root>
        <Command.List
          class={showList
            ? 'absolute inset-x-0 top-full z-50 mt-1.5 rounded-xl bg-popover p-1 shadow-[0_16px_40px_-16px_rgb(11_21_48/0.25)] ring-1 ring-foreground/10'
            : 'hidden'}
          onpointerdown={(event: PointerEvent) => event.preventDefault()}
        >
          {#if showList && results.length === 0}
            <p class="px-3 py-4 text-center text-sm text-muted-foreground">
              {searching ? 'Iščem ...' : 'Ni zadetkov. Člani in že povabljeni niso prikazani.'}
            </p>
          {/if}
          {#each results as user (user.id)}
            <Command.Item
              value={user.id}
              onSelect={() => select(user)}
              class="gap-3 rounded-lg px-2 py-2"
            >
              <Avatar.Root class="size-8 rounded-lg after:rounded-lg">
                <Avatar.Fallback
                  class="rounded-lg bg-secondary text-xs font-medium text-secondary-foreground"
                >
                  {getInitials(user.name)}
                </Avatar.Fallback>
              </Avatar.Root>
              <span class="flex min-w-0 flex-1 flex-col leading-tight">
                <span class="truncate text-sm font-medium">{user.name}</span>
                <span class="truncate text-xs text-muted-foreground">{user.email}</span>
              </span>
            </Command.Item>
          {/each}
        </Command.List>
      </Command.Root>
    {/if}
    {#if emailError}
      <Field.Error errors={[{ message: emailError }]} />
    {:else}
      <Field.Description>
        Poišči registriranega uporabnika po imenu ali vpiši njegov e-naslov.
      </Field.Description>
    {/if}
  </Field.Field>

  <Field.Set>
    <Field.Legend variant="label">Vloga</Field.Legend>
    <RadioGroup.Root bind:value={role} class="grid gap-3 sm:grid-cols-2">
      {#each INVITABLE_ROLE_OPTIONS as option (option.value)}
        <Field.Label for={`invite-role-${option.value}`}>
          <Field.Field orientation="horizontal">
            <RadioGroup.Item value={option.value} id={`invite-role-${option.value}`} />
            <Field.Content>
              <Field.Title>{option.label}</Field.Title>
              <Field.Description>{option.description}</Field.Description>
            </Field.Content>
          </Field.Field>
        </Field.Label>
      {/each}
    </RadioGroup.Root>
  </Field.Set>

  {#if formError}
    <p class="text-sm text-destructive" role="alert">{formError}</p>
  {/if}

  <Button type="submit" class="w-full sm:ml-auto sm:w-auto sm:min-w-36" disabled={isSubmitting}>
    {#if isSubmitting}
      <Spinner data-icon="inline-start" />
      Pošiljam ...
    {:else}
      Pošlji povabilo
    {/if}
  </Button>
</form>
