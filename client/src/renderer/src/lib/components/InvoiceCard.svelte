<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import * as Table from "$lib/components/ui/table";
  import type { Row } from "$lib/WorkbookData";
  import InputGroup from "$lib/components/InputGroup.svelte";
  import { Label } from "$lib/components/ui/label";
  import {
    type DateValue,
    getLocalTimeZone,
    today,
  } from "@internationalized/date";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import DatePicker from "$lib/components/ui/wrappers/DatePicker.svelte";
  import JobSelector from "$lib/components/JobSelector.svelte";
  import { printInvoice } from "$lib/utils";

  interface Props {
    customer: [string, string];
    rows: Row[];
    incomeAccount: string;
    postedAccount: string;
    action: string;
    accumulateSplits: boolean;
  }
  const {
    customer,
    rows,
    incomeAccount,
    postedAccount,
    accumulateSplits,
    action,
  }: Props = $props();

  let posting = $state(false);
  let billingID = $state("");
  let posted = $state<false | string>(false);

  let dueDate = $state<DateValue>(today(getLocalTimeZone()).add({ days: 30 }));

  async function createInvoice() {
    posting = true;
    const invoice = await fetch("http://localhost:5000/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: customer[1],
        date_opened: new Date().toISOString(),
      }),
    }).then((response) => response.json());

    for (const row of rows) {
      await fetch(`http://localhost:5000/invoices/${invoice.id}/entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: row.date.toString(),
          account_guid: incomeAccount,
          description: row.description,
          quantity: row.amount,
          price: row.rate,
          action: action,
        }),
      });
    }

    await fetch(`http://localhost:5000/invoices/${invoice.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        posted: "1",
        posted_account_guid: postedAccount,
        posted_date: new Date().toISOString(),
        posted_accumulatesplits: accumulateSplits,
        due_date: dueDate.toString(),
        billing_id: billingID,
      }),
    });
    posted = invoice.id;
  }
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Invoice for {customer[0]}</Card.Title>
  </Card.Header>
  {#if posted}
    <Card.Content>
      <Button onclick={() => posted && printInvoice(posted)} class="w-full"
        >View invoice</Button
      >
    </Card.Content>
  {:else}
    <Card.Content>
      <InputGroup>
        <Label>Entries</Label>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head class="w-[120px]">Date</Table.Head>
              <Table.Head>Description</Table.Head>
              <Table.Head class="w-[70px]">Amount</Table.Head>
              <Table.Head class="w-[70px]">Rate</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each rows as row}
              <Table.Row>
                <Table.Cell class="font-medium"
                  >{row.date.toString()}</Table.Cell
                >
                <Table.Cell>{row.description}</Table.Cell>
                <Table.Cell>{row.amount}</Table.Cell>
                <Table.Cell>{row.rate}</Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </InputGroup>
    </Card.Content>

    <Card.Footer>
      <div class="flex flex-col w-full gap-7">
        <InputGroup>
          <Label>Due date</Label>
          <DatePicker bind:value={dueDate} />
        </InputGroup>

        <InputGroup>
          <Label>Job</Label>
          <JobSelector customer={customer[1]} bind:value={billingID} />
        </InputGroup>

        <InputGroup>
          <Label>Reference</Label>
          <Input bind:value={billingID} />
        </InputGroup>

        <Button disabled={posting} onclick={createInvoice} class="w-full"
          >Create & post invoice</Button
        >
      </div>
    </Card.Footer>
  {/if}
</Card.Root>
