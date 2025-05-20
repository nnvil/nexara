<script lang="ts">
    import type { DialogButton as DialogButtonType } from "$lib/types/dialog";

    export let buttons: DialogButtonType[];
    export let closeFunc: () => void;
</script>

<div class="dialog-buttons">
    {#each buttons as button}
        <button
            class="button dialog-button"
            class:active={button.primary}
            on:click={async () => {
                if (button.action) {
                    await button.action();
                    closeFunc();
                }
                if (button.onClick) {
                    await button.onClick();
                }
            }}
        >
            {button.text}
        </button>
    {/each}
</div>

<style>
    .dialog-buttons {
        display: flex;
        flex-direction: row;
        align-items: end;
        justify-content: end;
        width: 100%;
        gap: calc(var(--padding) / 2);
        overflow: scroll;
        border-radius: var(--border-radius);
        min-height: 40px;
    }

    .dialog-button {
        display: flex;
        width: 100%;
        height: 40px;
        transition: 0.2s opacity;
    }
</style>
