<script lang="ts">
    import { tick } from "svelte";
    import dialogs from "$lib/state/dialogs";
    import { killDialog } from "$lib/state/dialogs";
    import InputDialog from "$components/dialog/InputDialog.svelte";
    import BaseDialog from "./BaseDialog.svelte";

    export let id: string | undefined = undefined;
    export let dismissable = true;

    let dialogParent: HTMLDialogElement | undefined;
    let open = false;
    let closing = false;

    $: backdropVisible = $dialogs.length > 0;

    export const close = () => {
        if (dialogParent) {
            closing = true;
            open = false;

            setTimeout(() => {
                if (dialogParent) {
                    dialogParent.close();
                    killDialog();
                }
            }, 250);
        }
    };

    $: if (dialogParent && id) {
        dialogParent.showModal();
        tick().then(() => {
            open = true;
        });
    }
</script>

{#if id}
    <dialog id="dialog-{id}" bind:this={dialogParent} class:closing class:open>
        <slot></slot>
        <div
            id="dialog-backdrop-close"
            aria-hidden="true"
            on:click={() => (dismissable ? close() : {})}
        ></div>
    </dialog>
{:else}
    <div id="dialog-holder">
        {#each $dialogs as dialog}
            {#if dialog.type === "input"}
                <InputDialog {...dialog} />
            {:else if dialog.type === "base"}
                <BaseDialog {...dialog} />
            {/if}
        {/each}
        <div id="backdrop" class:visible={backdropVisible}></div>
    </div>
{/if}

<style>
    :global(dialog) {
        display: flex;
        justify-content: center;
        align-items: center;
        background: none;

        max-height: 100%;
        max-width: 100%;
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        border: none;
        pointer-events: all;

        inset-inline-start: unset;
        inset-inline-end: unset;

        overflow: hidden;
    }

    #dialog-backdrop-close {
        position: inherit;
        height: 100%;
        width: 100%;
        z-index: -1;
    }

    #dialog-holder {
        position: fixed;
        padding-top: env(safe-area-inset-top);
        height: 100%;
        width: 100%;
        z-index: 99;

        justify-content: center;
        align-items: center;

        pointer-events: none;
    }

    #backdrop {
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: -1;

        background-color: var(--primary / 0.2);

        backdrop-filter: blur(0.5rem);
        -webkit-backdrop-filter: blur(0.5rem);

        opacity: 0;

        transition: opacity 0.2s;
    }

    #backdrop.visible {
        opacity: 1;
    }

    :global(.dialog-body) {
        display: flex;
        flex-direction: column;
        align-items: center;

        background: var(--primary);
        box-shadow: 0 0 0 1px var(--stroke) inset;
        border-radius: calc(var(--border-radius) * 2);

        padding: 18px;

        position: relative;
    }

    :global(dialog.open .dialog-body) {
        animation: modal-in 0.4s;
        animation-fill-mode: backwards;
    }

    :global(dialog.closing .dialog-body) {
        animation: modal-out 0.3s;
        opacity: 0;
    }
</style>
