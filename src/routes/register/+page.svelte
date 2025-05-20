<script lang="ts">
    import Nexara from "$components/icons/nexara.svelte";
    import {
        checkAuth,
        register,
        validateRegistrationData,
    } from "$lib/api/auth";
    import { onMount } from "svelte";
    import { socialLinks } from "../../lib/env";

    let username: string = "";
    let email: string = "";
    let password: string = "";
    let inviteCode: string = "";
    let serverError: string = "";

    onMount(async () => {
        if (await checkAuth()) {
            window.location.href = "/account";
        }
    });

    let errors = {
        username: "",
        email: "",
        password: "",
        inviteCode: "",
    };

    function validateField(
        field: "username" | "email" | "password" | "inviteCode"
    ) {
        const validationResult = validateRegistrationData({
            username,
            email,
            password,
            inviteCode,
        });
        errors[field] = validationResult?.[field] || "";
    }

    async function onKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault();
            await handleRegister();
        }
    }

    async function handleRegister() {
        serverError = "";
        const validationResult = validateRegistrationData({
            username,
            email,
            password,
            inviteCode,
        });

        if (validationResult) {
            errors = { ...errors, ...validationResult };
            return;
        }

        try {
            await register(username, email, password, inviteCode);
            window.location.href = "/account";
        } catch (error: any) {
            if (error.errorId === "invalid-invite") {
                errors.inviteCode = "Kod zaproszenia jest nieprawidłowy";
            } else if (error.errorId === "invalid-username") {
                errors.username = error.message;
            } else if (error.errorId === "invalid-password") {
                errors.password = error.message;
            } else if (error.errorId === "invalid-email") {
                errors.email = error.message;
            } else if (error.errorId === "username-taken") {
                errors.username = "Nazwa użytkownika jest już zajęta";
            } else {
                serverError = error.message;
            }
        }
    }
</script>

<svelte:head>
    <title>Zarejestruj się - nexara</title>
    <meta property="og:title" content="Zarejestruj się - nexara" />
</svelte:head>

<div id="wrapper" class="center">
    <main id="register-page">
        <Nexara size={48} color={"var(--brand)"} />
        <h1>Zarejestruj się</h1>
        <div id="input-holder">
            <div class="input-container">
                <span class="label">
                    Nazwa użytkownika
                    <span class="required">*</span>
                </span>
                <div
                    id="input-container"
                    class:error={errors.username}
                    aria-hidden="false"
                >
                    <input
                        class="input-box"
                        bind:value={username}
                        on:keydown={onKeyDown}
                        on:blur={() => validateField("username")}
                        autocomplete="off"
                        spellcheck="false"
                        autocapitalize="off"
                        required
                        aria-label="Username input"
                    />
                </div>
                {#if errors.username}
                    <div class="field-error">{errors.username}</div>
                {/if}
            </div>

            <div class="input-container">
                <span class="label">
                    Adres e-mail
                    <span class="required">*</span>
                </span>
                <div
                    id="input-container"
                    class:error={errors.email}
                    aria-hidden="false"
                >
                    <input
                        class="input-box"
                        bind:value={email}
                        on:keydown={onKeyDown}
                        on:blur={() => validateField("email")}
                        autocomplete="off"
                        spellcheck="false"
                        autocapitalize="off"
                        required
                        type="email"
                        aria-label="Email input"
                    />
                </div>
                {#if errors.email}
                    <div class="field-error">{errors.email}</div>
                {/if}
            </div>

            <div class="input-container">
                <span class="label">
                    Hasło
                    <span class="required">*</span>
                </span>
                <div
                    id="input-container"
                    class:error={errors.password}
                    aria-hidden="false"
                >
                    <input
                        class="input-box"
                        bind:value={password}
                        on:keydown={onKeyDown}
                        on:blur={() => validateField("password")}
                        autocomplete="off"
                        spellcheck="false"
                        autocapitalize="off"
                        required
                        aria-label="Password input"
                        type="password"
                    />
                </div>
                {#if errors.password}
                    <div class="field-error">{errors.password}</div>
                {/if}
            </div>

            <div class="input-container">
                <span class="label">
                    Zaproszenie
                    <span class="required">*</span>
                </span>
                <div
                    id="input-container"
                    class:error={errors.inviteCode}
                    aria-hidden="false"
                >
                    <input
                        class="input-box"
                        bind:value={inviteCode}
                        on:keydown={onKeyDown}
                        on:blur={() => validateField("inviteCode")}
                        autocomplete="off"
                        spellcheck="false"
                        autocapitalize="off"
                        required
                        aria-label="Invite code input"
                        type="password"
                    />
                </div>
                {#if errors.inviteCode}
                    <div class="field-error">{errors.inviteCode}</div>
                {/if}
            </div>

            {#if serverError}
                <div class="error-message">{serverError}</div>
            {/if}
            <button
                class="button"
                on:click|preventDefault={handleRegister}
                aria-label="Zarejestruj się"
            >
                Zarejestruj się
            </button>
        </div>

        <div id="info-block">
            <span>
                Masz już konto?
                <a href="/login">Zaloguj się.</a>
            </span>
            <span>
                <a href={socialLinks.discord}
                    >Nie wiesz skąd wziąć zaproszenie?</a
                >
            </span>
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

    .error-message {
        color: var(--red);
        font-size: 14px;
        text-align: left;
        margin-bottom: 10px;
    }

    .field-error {
        color: var(--red);
        text-align: left;
        font-weight: 500;
        font-size: 0.75rem;
    }

    #input-container.error {
        box-shadow: 0 0 0 2px var(--red) inset;
    }

    #register-page {
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
        min-width: 300px;
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
</style>
