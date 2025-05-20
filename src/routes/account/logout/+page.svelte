<script lang="ts">
    import { onMount } from "svelte";
    import { logout } from "$lib/api/auth";

    onMount(() => {
        logout();
    });
</script>

<div>Wylogowywanie...</div>
