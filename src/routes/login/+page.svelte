<script lang="ts">
    import Nexara from "$components/icons/nexara.svelte";
    import { checkAuth, login } from "$lib/api/auth";
    import { socialLinks } from "$lib/env";
    import { createDialog } from "$lib/state/dialogs";
    import { onMount } from "svelte";

    let username: string = "";
    let password: string = "";
    let errorMessage: string = "";

    onMount(async () => {
        if (await checkAuth()) {
            window.location.href = "/account";
        }
    });

    let input: HTMLInputElement;

    async function onKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault();
            await handleLogin();
        }
    }

    async function handleLogin() {
        errorMessage = "";
        try {
            await login(username, password);
            window.location.href = "/account";
        } catch (error: any) {
            if (error.errorId === "invalid-credentials") {
                errorMessage =
                    "Nazwa użytkownika lub hasło jest nieprawidłowe.";
            } else {
                errorMessage = "Wystąpił błąd podczas logowania.";
            }
        }
    }
</script>

<svelte:head>
    <title>Zaloguj się - nexara</title>
    <meta property="og:title" content="Zaloguj się - nexara" />
</svelte:head>

<div id="wrapper" class="center">
    <main id="login-page">
        <Nexara size={48} color={"var(--brand)"} />
        <h1>Witamy w nexara</h1>
        <div id="input-holder">
            <div class="input-container">
                <span class="label">
                    Nazwa użytkownika lub adres e-mail
                    <span class="required">*</span>
                </span>
                <div
                    id="input-container"
                    class:error={errorMessage}
                    aria-hidden="false"
                >
                    <input
                        class="input-box"
                        bind:this={input}
                        bind:value={username}
                        on:keydown={onKeyDown}
                        autocomplete="off"
                        spellcheck="false"
                        autocapitalize="off"
                        required
                        aria-label="Username input"
                    />
                </div>
            </div>

            <div class="input-container">
                <span class="label">
                    Hasło
                    <span class="required">*</span>
                </span>
                <div
                    id="input-container"
                    class:error={errorMessage}
                    aria-hidden="false"
                >
                    <input
                        class="input-box"
                        bind:this={input}
                        bind:value={password}
                        on:keydown={onKeyDown}
                        autocomplete="off"
                        spellcheck="false"
                        autocapitalize="off"
                        required
                        aria-label="Password input"
                        type="password"
                    />
                </div>
            </div>
            {#if errorMessage}
                <div class="error-message">{errorMessage}</div>
            {/if}
            <button
                class="button"
                on:click|preventDefault={handleLogin}
                aria-label="Zaloguj się"
            >
                Zaloguj się
            </button>
        </div>

        <div id="info-block">
            <span>
                Masz zaproszenie?
                <a href="/register">Zarejestruj się.</a>
            </span>
            {#if errorMessage}
                <a
                    class="cursor-pointer"
                    on:click={() => {
                        createDialog({
                            id: "forgot-password",
                            type: "base",
                            title: "Resetowanie hasła",
                            description: `W celu zresetowania hasła, stwórz nowe zgłoszenie na kanale <b style="color: var(--brand)">#ticket</b> na naszym serwerze <a style="color: var(--brand)" href="${socialLinks.discord}">Discord</a>.`,
                        });
                    }}>Zapomniałeś hasła?</a
                >
            {/if}
        </div>
    </main>
</div>

<style>
    #wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        background: var(--brand);
        overflow-x: hidden;
    }

    .label {
        text-align: left;
        font-size: 14px;
    }

    .required {
        color: var(--red);
    }

    #login-page {
        max-width: 600px;

        display: flex;
        background-color: var(--primary);
        padding: 2rem 5rem;
        border-radius: calc(var(--border-radius-lg) * 2);
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 15px;
    }

    #input-holder {
        width: 300px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .input-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
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

    #input-container.error {
        box-shadow: 0 0 0 2px var(--red) inset;
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
        padding: 11.5px 0;
    }

    #input-container:focus-within {
        box-shadow: 0 0 0 2px var(--brand) inset;
    }

    #info-block {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        color: var(--gray);

        font-weight: 500;
        font-size: 14.5px;
    }

    .error-message {
        font-weight: 500;
        font-size: 0.85rem;
        color: var(--red);
    }

    @media screen and (max-width: 750px) {
        #login-page {
            padding: 2rem 2rem;
        }
    }

    :global(#content) {
        border-radius: 0 !important;
    }
</style>
