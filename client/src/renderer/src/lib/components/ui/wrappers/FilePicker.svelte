<script lang="ts">
  import { Button } from "$lib/components/ui/button";

  interface Props {
    file: string | null;
  }
  let { file = $bindable(null) }: Props = $props();

  async function click() {
    file = await window.api.fileOpen(["xlsx", "csv", "ods"]);
  }

  const name = $derived(file && file.replaceAll("\\", "/").split("/").pop());
</script>

<Button variant="outline" onclick={click}><b>Choose file</b> {name}</Button>
