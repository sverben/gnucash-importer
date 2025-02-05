<script lang="ts">
  import * as Select from "$lib/components/ui/select";

  interface Option {
    value: string;
    label: string;
  }
  interface Props {
    options: Option[];
    value: string;
  }

  let { options, value = $bindable("") }: Props = $props();

  const triggerContent = $derived(
    options.find((f) => f.value === value)?.label ?? "Nothing selected",
  );
</script>

<Select.Root type="single" bind:value>
  <Select.Trigger class="w-full">
    {triggerContent}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#each options as option}
        <Select.Item value={option.value} label={option.label}>
          {option.label}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
