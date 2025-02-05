<script lang="ts">
  import SelectWrapper from "$lib/components/ui/wrappers/SelectWrapper.svelte";
  import * as Table from "$lib/components/ui/table";

  interface Props {
    enteredCustomers: string[];
    customerMappings: Record<string, string>;
  }

  let { enteredCustomers, customerMappings = $bindable() }: Props = $props();

  $effect.pre(() => {
    const existingMappings = Object.keys(customerMappings);

    enteredCustomers.forEach((enteredCustomer) => {
      if (!existingMappings.includes(enteredCustomer)) {
        customerMappings[enteredCustomer] = "";
      }
    });
  });

  interface Customer {
    id: string;
    guid: string;
    name: string;
  }

  async function getCustomers() {
    const customers: Customer[] = await fetch(
      "http://localhost:5000/customers",
    ).then((response) => response.json());

    return {
      options: customers.map((customer) => ({
        value: customer.id,
        label: customer.name,
      })),
    };
  }

  const customers = getCustomers();
</script>

{#await customers}
  <p>Loading...</p>
{:then { options }}
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[100px]">Date</Table.Head>
        <Table.Head>Customer</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each enteredCustomers as enteredCustomer}
        <Table.Row>
          <Table.Cell class="font-medium">{enteredCustomer}</Table.Cell>
          <Table.Cell>
            <SelectWrapper
              {options}
              bind:value={customerMappings[enteredCustomer]}
            />
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
{/await}
