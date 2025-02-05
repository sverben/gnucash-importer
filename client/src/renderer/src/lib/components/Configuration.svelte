<script lang="ts">
  import TableMappings from "$lib/components/TableMappings.svelte";
  import WorkbookData from "$lib/WorkbookData";
  import SelectWrapper from "$lib/components/ui/wrappers/SelectWrapper.svelte";
  import { Label } from "$lib/components/ui/label";
  import InputGroup from "$lib/components/InputGroup.svelte";
  import type { DateRange } from "bits-ui";
  import {
    endOfMonth,
    getLocalTimeZone,
    startOfMonth,
    today,
  } from "@internationalized/date";
  import DateRangePicker from "$lib/components/ui/wrappers/DateRangePicker.svelte";
  import { Separator } from "$lib/components/ui/separator";
  import CustomerLinks from "$lib/components/CustomerLinks.svelte";
  import InvoiceCard from "$lib/components/InvoiceCard.svelte";
  import AccountSelector from "$lib/components/AccountSelector.svelte";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import configuration from "$lib/configuration.svelte";

  interface Props {
    workbook: WorkbookData;
  }
  let { workbook }: Props = $props();

  let sheetOptions = $derived(
    workbook.sheets.map((sheet) => ({
      value: sheet.name,
      label: sheet.name,
    })),
  );

  function getDateRange() {
    let date = today(getLocalTimeZone());
    date = date.subtract({ months: 1 });

    return { start: startOfMonth(date), end: endOfMonth(date) };
  }

  let sheet = $derived(
    workbook.sheets.find((sheet) => sheet.name === configuration.sheetValue)
      ?.sheet,
  );
  let dateRange = $state<DateRange>(getDateRange());

  const relevantValues = $derived(
    sheet?.getRelevantValues(
      configuration.mappings,
      dateRange.start,
      dateRange.end,
    ),
  );
</script>

<InputGroup>
  <Label>Sheet</Label>
  <SelectWrapper options={sheetOptions} bind:value={configuration.sheetValue} />
</InputGroup>

<Separator />
<h2 class="text-2xl text-center">Configuration</h2>

{#if sheet}
  <InputGroup>
    <Label>Posted account</Label>
    <AccountSelector bind:value={configuration.postedAccount} />
  </InputGroup>
  <div class="flex align-center gap-1.5">
    <Label>Accumulate splits</Label>
    <Checkbox bind:checked={configuration.accumulateSplits} />
  </div>
  <InputGroup>
    <Label>Income account</Label>
    <AccountSelector bind:value={configuration.incomeAccount} />
  </InputGroup>
  <InputGroup>
    <Label>Action</Label>
    <Input type="text" bind:value={configuration.action} />
  </InputGroup>
  <InputGroup>
    <Label>Date range</Label>
    <DateRangePicker bind:value={dateRange} />
  </InputGroup>

  <InputGroup>
    <Label>Table mappings</Label>
    <TableMappings bind:mappings={configuration.mappings} {sheet} />
  </InputGroup>

  {#if relevantValues}
    <Separator />
    <h2 class="text-2xl text-center">Customers</h2>

    <CustomerLinks
      enteredCustomers={Object.keys(relevantValues)}
      bind:customerMappings={configuration.customerMappings}
    />

    <Separator />
    <h2 class="text-2xl text-center">Invoices</h2>
    {#if !configuration.action}
      <p>Define an action first</p>
    {/if}
    {#if !configuration.incomeAccount}
      <p>Define an income account first</p>
    {/if}
    {#if !configuration.postedAccount}
      <p>Define a posted account first</p>
    {/if}
    {#if configuration.action && configuration.incomeAccount && configuration.postedAccount}
      {#each Object.entries(configuration.customerMappings) as customer (customer[0])}
        {#if customer[1]}
          <InvoiceCard
            accumulateSplits={configuration.accumulateSplits}
            action={configuration.action}
            incomeAccount={configuration.incomeAccount}
            postedAccount={configuration.postedAccount}
            {customer}
            rows={relevantValues[customer[0]]}
          />
        {/if}
      {/each}
    {/if}
  {/if}
{/if}
