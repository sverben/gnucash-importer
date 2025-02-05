<script lang="ts">
  import { Label } from "$lib/components/ui/label";
  import FilePicker from "$lib/components/ui/wrappers/FilePicker.svelte";
  import Configuration from "$lib/components/Configuration.svelte";
  import InputGroup from "$lib/components/InputGroup.svelte";
  import configuration from "$lib/configuration.svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Input } from "$lib/components/ui/input";
  import { printInvoice } from "$lib/utils";
  import { ModeWatcher } from "mode-watcher";

  let invoiceID = $state("");
</script>

<ModeWatcher defaultMode="dark" />
<div class="flex flex-col p-8 m-auto max-w-2xl gap-7">
  <h1 class="text-3xl text-center">GNUCash importer</h1>

  <InputGroup>
    <Label for="sheetFile">Sheet (.ods/.xlsx/.csv)</Label>
    <FilePicker bind:file={configuration.workbookFile} />
  </InputGroup>

  {#if configuration.workbookPromise}
    {#await configuration.workbookPromise}
      <p>Loading...</p>
    {:then workbook}
      <Configuration {workbook} />
    {:catch error}
      <p>{error.message}</p>
    {/await}
  {/if}

  <Dialog.Root>
    <Dialog.Trigger class={buttonVariants({ variant: "outline" })}
      >Print an existing invoice</Dialog.Trigger
    >
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Print invoice</Dialog.Title>
      </Dialog.Header>

      <InputGroup>
        <Label>Invoice ID</Label>
        <Input bind:value={invoiceID} />
      </InputGroup>

      <Button onclick={() => printInvoice(invoiceID)} class="w-full"
        >Print</Button
      >
    </Dialog.Content>
  </Dialog.Root>
</div>
