<script lang="ts">
    import { createDialog } from "$lib/state/dialogs";
    import IconBrandDiscord from "@tabler/icons-svelte/IconBrandDiscord.svelte";
    import IconBrandGit from "@tabler/icons-svelte/IconBrandGit.svelte";
    import IconX from "@tabler/icons-svelte/IconX.svelte";

    type Processor = "discord" | "git" | null;
    let processor: Processor = null;

    let claimed = true;
    export let data;
    const username: string = data.user?.username || "";

    function handleDisconnect() {
        createDialog({
            id: "disconnect-dialog",
            type: "base",
            title: "Odłącz konto Discord",
            description: "Czy na pewno chcesz odłączyć konto Discord?",
            buttons: [
                {
                    text: "Anuluj",
                    action: () => {},
                },
                {
                    text: "Odłącz",
                    primary: true,
                    action: () => {
                        console.log("TODO");
                    },
                },
            ],
        });
    }
</script>

<svelte:head>
    <title>Moje konto - nexara</title>
    <meta property="og:title" content="Moje konto - nexara" />
</svelte:head>

<div id="wrapper">
    <main id="donate-page">
        <div class="connection-card">
            <div id="connections">
                {#if !claimed}
                    <button
                        class="connection"
                        on:click={() => (processor = "discord")}
                        class:claimed
                        disabled={claimed}
                    >
                        <div class="connection-icon"><IconBrandDiscord /></div>
                        <div class="connection-title">Discord</div>
                        <div class="connection-subtitle">
                            Połącz swoje konto Discord z nexara, aby zyskać rolę
                            klubowicza
                        </div>
                    </button>
                {:else}
                    <button
                        class="connection"
                        on:click={() => (processor = "discord")}
                        class:claimed
                        disabled={claimed}
                    >
                        <!-- svelte-ignore a11y_interactive_supports_focus -->
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <div
                            role="button"
                            on:click={handleDisconnect}
                            id="disconnect-button"
                        >
                            <IconX size={16} />
                        </div>
                        <div class="connection-icon"><IconBrandDiscord /></div>
                        <div class="connection-title">Discord</div>
                        <div class="connection-subtitle">
                            {username}
                        </div>
                    </button>
                {/if}

                <button class="connection" on:click={() => (processor = "git")}>
                    <div class="connection-icon"><IconBrandGit /></div>
                    <div class="connection-title">Git</div>
                    <div class="connection-subtitle">
                        Odbierz swoje konto na naszej instancji <a
                            href="https://git.nexara.club">Gita</a
                        >
                    </div>
                </button>
            </div>
        </div>
    </main>
</div>

<style>
    #wrapper {
        padding: var(--padding);
    }

    #donate-page {
        max-width: 100%;
        width: 900px;

        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    #connections {
        display: flex;
        gap: calc(1rem / 2);
        overflow: scroll;
    }

    .connection {
        width: 100%;
        overflow: hidden;
        gap: 2px;
        position: relative;
    }

    .connection.claimed {
        opacity: 0.5;
    }

    #disconnect-button {
        position: absolute;
        top: 12px;
        right: 12px;
        cursor: pointer;
        color: var(--text-muted);
    }

    .connection-icon {
        display: flex;
    }

    .connection-icon :global(svg) {
        width: 28px;
        height: 28px;
        stroke-width: 1.8px;
    }

    .connection-card button {
        max-width: 400px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: start;
        background: rgba(255, 255, 255, 0.05);
        padding: 12px 16px;
        color: var(--white);
        gap: 0;
        letter-spacing: -0.3px;
    }

    .connection-card button {
        box-shadow: none;
    }

    @media (hover: hover) {
        .connection-card button:hover:not(.claimed) {
            background: rgba(255, 255, 255, 0.1);
        }
    }

    .connection-card button:active:not(.claimed) {
        background: rgba(255, 255, 255, 0.125);
    }

    .connection-subtitle {
        font-size: 13px;
        color: var(--white);
        opacity: 0.5;
        line-height: 1.5;
    }

    .connection-title {
        display: flex;
        align-items: center;
        font-size: 16px;
        gap: 4px;
        font-weight: 500;
    }
</style>
