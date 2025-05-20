<script lang="ts">
    import DialogButtons from "$components/dialog/DialogButtons.svelte";
    import Dialog from "$components/dialog/Dialog.svelte";
    import type { DialogButton, DialogInput } from "$lib/types/dialog";
    import type { Optional } from "$lib/types/generic";

    export let id: string;
    export const type = "input";
    export let title = "";
    export let description = "";
    export let buttons: Optional<DialogButton[]> = undefined;
    export let dismissable = true;
    export let inputs: DialogInput[] = [];

    let inputValues: Record<string, string> = {};
    let close: () => void;

    $: {
        inputs.forEach((input) => {
            if (input.value && !inputValues[input.id]) {
                inputValues[input.id] = input.value;
            }
        });
    }

    let error = "";
    let success = false;
    let successTitle = "";
    let successMessage = "";
    let successButtons: DialogButton[] = [];

    async function handleSubmit() {
        const values = { ...inputValues };
        if (buttons) {
            const submitButton = buttons.find((b) => b.type === "submit");
            if (submitButton?.onClick) {
                try {
                    const result = await submitButton.onClick(values);
                    if (result) {
                        error = "";
                        success = true;
                        successTitle = result.title;
                        successMessage = result.message;
                        successButtons = result.buttons;
                    } else {
                        close();
                    }
                } catch (e: unknown) {
                    error = e instanceof Error ? e.message : "Wystąpił błąd";
                }
            }
        }
    }
</script>

<Dialog {id} {dismissable} bind:close>
    {#if success}
        <div class="dialog-body input-dialog success-dialog">
            <div class="dialog-inner-container">
                <div class="popup-header">
                    <h2 class="popup-title" tabindex="-1">{successTitle}</h2>
                </div>
                <div class="body-text" tabindex="-1">{successMessage}</div>
            </div>
            <DialogButtons buttons={successButtons} closeFunc={close} />
        </div>
    {:else}
        <form
            class="dialog-body input-dialog"
            on:submit|preventDefault={handleSubmit}
        >
            <div class="dialog-inner-container">
                {#if title}
                    <div class="popup-header">
                        <h2 class="popup-title" tabindex="-1">{title}</h2>
                    </div>
                {/if}
                {#if description}
                    <div class="body-text" tabindex="-1">{description}</div>
                {/if}

                <div class="inputs-container">
                    {#each inputs as input}
                        <div class="input-container">
                            <span class="label">{input.label}</span>
                            <div id="input-container" aria-hidden="false">
                                <input
                                    class="input-box"
                                    id={input.id}
                                    type={input.type || "text"}
                                    bind:value={inputValues[input.id]}
                                    placeholder={input.placeholder || ""}
                                    required={input.required}
                                    autocomplete="off"
                                    spellcheck="false"
                                    autocapitalize="off"
                                />
                            </div>
                        </div>
                    {/each}
                </div>

                {#if error}
                    <div class="error-message">{error}</div>
                {/if}
            </div>
            {#if buttons}
                <DialogButtons {buttons} closeFunc={close} />
            {/if}
        </form>
    {/if}
</Dialog>

<style>
    .input-dialog,
    .dialog-inner-container {
        display: flex;
        flex-direction: column;
        gap: var(--padding);
    }

    .dialog-inner-container {
        overflow-y: auto;
        width: 100%;
        gap: 8px;
    }

    .input-dialog {
        text-align: center;
        max-width: 400px;
        width: calc(100% - var(--padding) - var(--dialog-padding) * 2);
        max-height: 85%;
        margin: calc(var(--padding) / 2);
    }

    .popup-title {
        color: var(--secondary);
        font-size: 19px;
    }

    .popup-header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .label {
        font-weight: 600;
        text-align: left;
        font-size: 14px;
    }

    .inputs-container {
        min-width: 300px;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .input-container {
        flex-direction: column;
        gap: 0.5rem;
        display: flex;
    }

    #input-container {
        padding: 0 16px;
        border-radius: var(--border-radius);
        color: var(--secondary);
        background-color: var(--button);
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
    }

    #input-container,
    .input-box {
        font-size: 13px;
        font-weight: 500;
        min-width: 0;
    }

    .input-box {
        flex: 1;
        background-color: transparent;
        color: var(--secondary);
        border: none;
        padding-block: 0;
        padding-inline: 0;
        padding: 11px 0;
    }

    #input-container:focus-within {
        box-shadow: 0 0 0 2px var(--brand) inset;
    }

    .error-message {
        padding: 2px;
        font-weight: 500;
        font-size: 0.85rem;
        color: var(--red);
    }

    .success-dialog {
        text-align: center;
    }
</style>
