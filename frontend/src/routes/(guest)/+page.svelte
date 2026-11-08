<script lang="ts">
  import { AuthDialog, type AuthMode } from '#lib/features/auth/index.js';
  import { ProductPreview } from '#lib/features/landing/index.js';
  import { Logo } from '#lib/shared/components/logo/index.js';
  import { Button } from '#lib/shared/ui/button/index.js';

  let open = $state(false);
  let mode = $state<AuthMode>('register');

  function openDialog(nextMode: AuthMode) {
    mode = nextMode;
    open = true;
  }
</script>

<svelte:head>
  <title>Leftover · skupna zaloga hrane za gospodinjstvo</title>
  <meta
    name="description"
    content="Leftover pokaže, katera živila v hladilniku bodo prva potekla, iz načrtovanih obrokov sestavi nakupovalni seznam in po kuhanju odšteje porabljeno."
  />
</svelte:head>

<div class="flex min-h-svh flex-col">
  <header class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
    <Logo />
    <Button variant="ghost" onclick={() => openDialog('login')}>Prijava</Button>
  </header>

  <main class="flex-1 overflow-hidden">
    <section
      class="mx-auto flex w-full max-w-6xl animate-in flex-col items-center px-4 pt-12 text-center duration-500 fade-in slide-in-from-bottom-2 sm:px-8 sm:pt-20"
    >
      <p class="text-[13px] font-medium text-primary">
        Lastnik, člani in gostje vidijo isti hladilnik
      </p>
      <h1
        class="mt-4 max-w-3xl font-display text-[40px] leading-[1.04] font-normal tracking-[-0.04em] text-balance sm:text-[64px]"
      >
        Ena zaloga hrane za celo gospodinjstvo
      </h1>
      <p class="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-brand-ink">
        Vpišeš, kar je v hladilniku. Leftover pokaže, kaj bo prvo poteklo, iz načrtovanih obrokov
        sestavi nakupovalni seznam in po kuhanju odšteje porabljeno.
      </p>
      <div class="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
        <Button size="lg" class="h-11 px-5 text-[15px]" onclick={() => openDialog('register')}>
          Ustvari račun
        </Button>
        <Button
          size="lg"
          variant="outline"
          class="h-11 px-5 text-[15px]"
          onclick={() => openDialog('login')}
        >
          Prijavi se
        </Button>
      </div>
    </section>

    <section
      class="mx-auto mt-16 w-full max-w-6xl animate-in px-4 delay-150 duration-700 fill-mode-both fade-in slide-in-from-bottom-4 sm:mt-20 sm:px-8"
    >
      <ProductPreview />
    </section>
  </main>
</div>

<AuthDialog bind:open bind:mode />
