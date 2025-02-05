<script lang="ts">
  import SelectWrapper from "$lib/components/ui/wrappers/SelectWrapper.svelte";

  interface Props {
    value: string;
  }

  let { value = $bindable() }: Props = $props();

  interface Response {
    subaccounts: {
      guid: string;
      name: string;
    }[];
  }

  async function getAccounts() {
    const account: Response = await fetch(
      "http://localhost:5000/accounts",
    ).then((response) => response.json());

    return account.subaccounts.map((subaccount) => ({
      value: subaccount.guid,
      label: subaccount.name,
    }));
  }

  const accounts = getAccounts();
</script>

{#await accounts}
  <p>Loading...</p>
{:then options}
  <SelectWrapper {options} bind:value />
{/await}
