<script lang="ts">
    import type { Optional } from "$lib/types/generic";
    import type { DialogButton } from "$lib/types/dialog";

    import Dialog from "$components/dialog/Dialog.svelte";

    import DialogButtons from "$components/dialog/DialogButtons.svelte";

    import IconX from "@tabler/icons-svelte/IconX.svelte";

    export let id: string;
    export let title = "";
    export let description = "";
    export let buttons: Optional<DialogButton[]> = undefined;
    export let dismissable = true;

    let close: () => void;
</script>

<Dialog {id} {dismissable} bind:close>
    <div class="dialog-body base-dialog">
        <div class="dialog-inner-container">
            {#if title}
                <div class="dialog-header">
                    <h2 class="dialog-title" tabindex="-1">{title}</h2>
                </div>
            {/if}
            {#if description}
                <div class="body-text" tabindex="-1">{@html description}</div>
            {/if}
        </div>
        {#if buttons}
            <DialogButtons {buttons} closeFunc={close} />
        {/if}
        <div role="button" on:click={close} id="close-button">
            <IconX size={16} />
        </div>
    </div>
</Dialog>

<style>
    .base-dialog,
    .dialog-inner-container {
        display: flex;
        flex-direction: column;
        gap: var(--padding);
    }

    .dialog-inner-container {
        overflow-y: scroll;
        gap: 8px;
    }

    .base-dialog {
        text-align: center;
        max-width: 340px;
        width: calc(100% - var(--padding) - var(--dialog-padding) * 2);
        max-height: 85%;
        margin: calc(var(--padding) / 2);
    }

    .dialog-title {
        color: var(--secondary);
        font-size: 19px;
    }

    .dialog-header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #close-button {
        position: absolute;
        top: 16px;
        right: 16px;
        cursor: pointer;
        color: var(--gray);
    }

    .body-text {
        font-size: 14.5px;
        font-weight: 500;
        line-height: 1.7;
        color: var(--gray);
        white-space: pre-wrap;
        user-select: text;
        -webkit-user-select: text;
    }
</style>
