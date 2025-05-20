<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { onMount } from "svelte";

    onMount(() => {
        if (page.error?.message === "Not Found") {
            goto("/", { replaceState: true });
        }
    });
</script>
