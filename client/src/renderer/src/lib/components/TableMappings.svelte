<script lang="ts">
  import * as Table from "$lib/components/ui/table";
  import { SheetData } from "$lib/WorkbookData";
  import SelectWrapper from "$lib/components/ui/wrappers/SelectWrapper.svelte";
  import { type Mappings } from "$lib/mappings";

  interface Props {
    sheet: SheetData;
    mappings: Mappings;
  }
  let { sheet, mappings = $bindable() }: Props = $props();

  const options = $derived(
    sheet.columns.map((column) => ({
      value: column.col,
      label: column.name,
    })),
  );
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">Item</Table.Head>
      <Table.Head>Column</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each mappings as mapping (mapping.id)}
      <Table.Row>
        <Table.Cell class="font-medium">{mapping.item}</Table.Cell>
        <Table.Cell>
          <SelectWrapper {options} bind:value={mapping.column} />
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
