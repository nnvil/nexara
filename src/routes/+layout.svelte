<script lang="ts">
    import { page } from "$app/stores";
    import env from "$lib/env";
    import { user } from "$lib/stores/user";
    import { isLoading } from "$lib/stores/loading";
    import { onMount } from "svelte";
    import NexaraLogo from "$components/icons/nexara.svelte";

    import Dialog from "$components/dialog/Dialog.svelte";

    onMount(() => {
        setTimeout(() => isLoading.set(false), 500);
    });

    $: if ($page.data.user) {
        user.set({
            id: $page.data.user.id,
            username: $page.data.user.username,
            isAuthenticated: $page.data.user.isAuthenticated,
            avatarUrl: $page.data.user.avatarUrl,
            createdAt: $page.data.user.createdAt,
            email: $page.data.user.email,
            isAdmin: $page.data.user.isAdmin,
        });
    } else {
        user.reset();
    }
</script>

<svelte:head>
    <meta
        name="description"
        content="Społeczność pasjonatów technologii, wolnego oprogramowania i
            prywatności. Dążymy do stworzenia inspirującego i wspierającego
            środowiska, w którym każdy może się rozwijać."
    />
    <meta
        property="og:description"
        content="Społeczność pasjonatów technologii, wolnego oprogramowania i
            prywatności. Dążymy do stworzenia inspirującego i wspierającego
            środowiska, w którym każdy może się rozwijać."
    />

    <meta
        property="og:url"
        content="https://{env.hostname}{$page.url.pathname}"
    />

    <meta name="theme-color" content="#000000" />
</svelte:head>

<div lang="ts">
    <div id="container">
        {#if $isLoading}
            <div class="loading-overlay center">
                <div class="logo">
                    <NexaraLogo size={64} />
                </div>
            </div>
        {/if}

        <Dialog />
        <div id="content">
            <slot></slot>
        </div>
    </div>
</div>

<style>
    @import "../app.css";

    .loading-overlay {
        position: fixed;
        inset: 0;
        display: flex;
        background-color: var(--primary);
        z-index: 1000;
    }

    .logo {
        color: var(--brand);
        animation: pulse 2s infinite;
    }

    #container {
        display: flex;
        height: 100vh;
        width: 100%;
        overflow: hidden;
        color: var(--secondary);
    }

    #content {
        display: flex;
        width: 100%;
        overflow: scroll;
        background-color: var(--primary);
        border-radius: var(--border-radius);
        margin: calc(var(--sidebar-inner-padding) + 2px);
    }
</style>
