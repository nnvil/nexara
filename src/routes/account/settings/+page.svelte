<script lang="ts">
    import Pencil from "$components/icons/Pencil.svelte";
    import FileReceiver from "$components/misc/FileReceiver.svelte";
    import {
        changeEmail,
        changePassword,
        validatePassword,
    } from "$lib/api/auth";
    import { api } from "$lib/api/client";
    import env, { socialLinks } from "$lib/env";
    import { createDialog } from "$lib/state/dialogs";
    import { user } from "$lib/stores/user";
    import { formatDate } from "$lib/utils/dateConverter.js";

    $: avatar = $user?.avatarUrl;
    $: username = $user?.username || "";
    $: email = $user?.email || "";
    $: memberSince = $user?.createdAt ? formatDate($user.createdAt) : "";

    function handleUploadSuccess({ avatarUrl }: { avatarUrl: string }) {
        avatar = avatarUrl;
    }

    function handleFileError(event: CustomEvent<string>) {
        alert(event.detail);
    }
</script>

<svelte:head>
    <title>Moje konto - nexara</title>
    <meta property="og:title" content="Moje konto - nexara" />
</svelte:head>

<div id="wrapper">
    <h1>Moje konto</h1>
    <main id="user-details">
        <div class="user-container">
            <div class="profile-picture">
                <div>
                    <img
                        class="profile-picture"
                        src={avatar}
                        alt="Profile Picture"
                    />
                    <div
                        tabindex="0"
                        class="avatar-overlay dropdown dropdown-right"
                    >
                        <div>
                            <Pencil />
                        </div>
                        <div
                            tabindex="-1"
                            class="dropdown-menu menu dropdown-content"
                        >
                            <FileReceiver
                                id="avatar-input"
                                uploadUrl={`${env.api}/users/me/avatar`}
                                onSuccess={handleUploadSuccess}
                                on:error={handleFileError}
                            >
                                <button>Zmień awatar</button>
                            </FileReceiver>
                            <button
                                on:click={() => {
                                    try {
                                        api.delete("/users/me/avatar");
                                        avatar = `${env.api}/public/avatars/default.png`;
                                    } catch (error) {
                                        createDialog({
                                            type: "base",
                                            id: "error",
                                            description:
                                                "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.",
                                            title: "Oopsie daisy!",
                                        });
                                    }
                                }}>Usuń awatar</button
                            >
                        </div>
                    </div>
                </div>
            </div>
            <h1>{username}</h1>
        </div>
        <div id="account-details">
            <div>
                <span class="label">Członek od</span>
                <p>{memberSince}</p>
            </div>
            <div>
                <span class="label">Adres E-Mail</span>
                <div class="field">
                    <p>{email}</p>
                    <button
                        class="button email"
                        on:click={() => {
                            createDialog({
                                id: "change-email",
                                type: "input",
                                title: "Zaktualizuj adres e-mail",
                                inputs: [
                                    {
                                        id: "new-email",
                                        label: "Nowy adres e-mail",
                                        type: "email",
                                        required: true,
                                    },
                                    {
                                        id: "current-password",
                                        label: "Bieżące hasło",
                                        type: "password",
                                        required: true,
                                    },
                                ],
                                buttons: [
                                    {
                                        text: "Anuluj",
                                        action: () => {},
                                    },
                                    {
                                        text: "Gotowe",
                                        primary: true,
                                        type: "submit",
                                        onClick: async (values) => {
                                            if (!values) return;
                                            const newEmail =
                                                values["new-email"];
                                            const password =
                                                values["current-password"];

                                            try {
                                                await changeEmail(
                                                    newEmail,
                                                    password
                                                );
                                            } catch (error: any) {
                                                if (
                                                    error.errorId ===
                                                    "invalid-current-password"
                                                ) {
                                                    throw new Error(
                                                        "Bieżące hasło jest nieprawidłowe"
                                                    );
                                                } else if (
                                                    error.errorId ===
                                                    "invalid-email"
                                                ) {
                                                    throw new Error(
                                                        "Adres e-mail jest nieprawidłowy"
                                                    );
                                                } else {
                                                    throw new Error(
                                                        "Wystąpił błąd podczas zmiany adresu e-mail"
                                                    );
                                                }
                                            }

                                            return {
                                                title: "Sukces",
                                                message:
                                                    "Adres e-mail został zmieniony",
                                                buttons: [
                                                    {
                                                        text: "OK",
                                                        type: "submit",
                                                        action: () => {},
                                                    },
                                                ],
                                            };
                                        },
                                    },
                                ],
                            });
                        }}>Edytuj</button
                    >
                </div>
            </div>
            <div class="input-container">
                <span class="label">Hasło</span>
                <button
                    class="button"
                    on:click={() => {
                        createDialog({
                            id: "change-password",
                            type: "input",
                            title: "Zaktualizuj hasło",
                            inputs: [
                                {
                                    id: "current-password",
                                    label: "Bieżące hasło",
                                    type: "password",
                                    required: true,
                                },
                                {
                                    id: "new-password",
                                    label: "Nowe hasło",
                                    type: "password",
                                    required: true,
                                },
                                {
                                    id: "confirm-password",
                                    label: "Potwierdź nowe hasło",
                                    type: "password",
                                    required: true,
                                },
                            ],
                            buttons: [
                                {
                                    text: "Anuluj",
                                    action: () => {},
                                },
                                {
                                    text: "Gotowe",
                                    primary: true,
                                    type: "submit",
                                    onClick: async (values) => {
                                        if (!values) return;
                                        const currentPassword =
                                            values["current-password"];
                                        const newPassword =
                                            values["new-password"];
                                        const confirmPassword =
                                            values["confirm-password"];

                                        if (newPassword !== confirmPassword) {
                                            throw new Error(
                                                "Hasła nie są identyczne"
                                            );
                                        }

                                        if (validatePassword(newPassword)) {
                                            throw new Error(
                                                validatePassword(newPassword)
                                            );
                                        }

                                        try {
                                            await changePassword(
                                                currentPassword,
                                                newPassword
                                            );
                                        } catch (error: any) {
                                            if (
                                                error.errorId ===
                                                "invalid-current-password"
                                            ) {
                                                throw new Error(
                                                    "Bieżące hasło jest nieprawidłowe"
                                                );
                                            } else {
                                                throw new Error(
                                                    "Wystąpił błąd podczas zmiany hasła"
                                                );
                                            }
                                        }

                                        return {
                                            title: "Sukces",
                                            message: "Hasło zostało zmienione",
                                            buttons: [
                                                {
                                                    text: "OK",
                                                    type: "submit",
                                                    action: () => {},
                                                },
                                            ],
                                        };
                                    },
                                },
                            ],
                        });
                    }}
                    aria-label="Zaloguj się"
                >
                    Zmień hasło
                </button>
            </div>
        </div>
    </main>
    <h1>Usunięcie konta</h1>
    <button
        on:click={() => {
            createDialog({
                id: "delete-account",
                type: "base",
                title: "Usunięcie konta",
                description: `W celu usunięcia konta, stwórz nowe zgłoszenie na kanale <b style="color: var(--brand)">#ticket</b> na naszym serwerze <a style="color: var(--brand)" href="${socialLinks.discord}">Discord</a>.`,
            });
        }}
        class="btn-delete w-max">Usuń konto</button
    >
</div>

<style>
    #wrapper {
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        gap: var(--padding);
        padding: var(--padding);
    }

    #user-details {
        display: flex;
        padding: calc(var(--padding) * 1.5);
        justify-content: center;
        align-items: start;
        flex-direction: column;
        gap: 15px;
        background: black;
        border-radius: var(--border-radius);
        font-size: 14px;
    }

    .user-container {
        display: flex;
        align-items: center;
        gap: var(--padding);
    }

    #account-details {
        display: flex;
        flex-direction: column;
        background: #070709;
        border-radius: var(--border-radius);
        gap: var(--padding);
        padding: var(--padding);
    }

    .label {
        font-weight: 600;
        color: var(--white);
    }

    .profile-picture {
        width: 80px;
        height: 80px;
        position: relative;
        /* overflow: hidden; */
        cursor: pointer;
    }

    .avatar-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .avatar-overlay :global(svg) {
        width: 24px;
        height: 24px;
        color: white;
    }

    .profile-picture:hover .avatar-overlay {
        opacity: 1;
    }

    .dropdown-menu {
        display: flex;
        flex-direction: column;

        background: var(--primary);
        box-shadow: 0 0 0 1px var(--stroke) inset;
        border-radius: var(--border-radius);

        padding: calc(var(--padding) / 2);
        min-width: max-content;
        gap: 5px;
        margin: 2rem 0.25rem;
    }

    .dropdown-menu button {
        font-size: 13.5px;
        background: none;
        border-radius: calc(var(--border-radius) / 2.5);
        padding: calc(var(--padding) / 2) calc(var(--padding));
    }

    .dropdown-menu button:hover {
        background: var(--button);
    }

    .input-container {
        width: 250px;
        flex-direction: column;
        gap: 0.5rem;
        display: flex;
    }
    .field {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    button {
        padding: 0.25rem 0.75rem;
        font-size: 16px;
    }

    .btn-delete {
        background-color: var(--dark-red);
        transition: background 0.2s;
    }

    .btn-delete:hover {
        background-color: var(--red);
    }

    @media screen and (max-width: 750px) {
        #wrapper {
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
            gap: var(--padding);
            padding: calc(var(--padding) * 2);
        }
    }
</style>
