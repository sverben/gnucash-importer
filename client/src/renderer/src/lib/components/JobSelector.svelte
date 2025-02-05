<script lang="ts">
  import SelectWrapper from "$lib/components/ui/wrappers/SelectWrapper.svelte";

  interface Props {
    customer: string;
    value: string;
  }

  let { value = $bindable(), customer }: Props = $props();

  interface Job {
    reference: string;
    name: string;
  }

  async function getJobs() {
    const jobs: Job[] = await fetch(
      `http://localhost:5000/jobs?customer=${customer}`,
    ).then((response) => response.json());

    return jobs.map((job) => ({
      value: job.reference,
      label: job.name,
    }));
  }

  const jobs = getJobs();
</script>

{#await jobs}
  <p>Loading...</p>
{:then options}
  <SelectWrapper {options} bind:value />
{/await}
