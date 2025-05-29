<script lang="ts">
    import env from "$lib/env";
    import { onMount } from "svelte";

    let isEnabled = false;

    onMount(() => {
        const storedValue = localStorage.getItem("hidden");
        isEnabled = storedValue === "true";
    });

    async function togglePrivacy() {
        isEnabled = !isEnabled;

        localStorage.setItem("hidden", isEnabled.toString());

        try {
            const response = isEnabled
                ? await fetch(`${env.api}/users/me/private`, {
                      method: "PUT",
                      credentials: "include",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ private: true }),
                  })
                : await fetch(`${env.api}/users/me/private`, {
                      method: "DELETE",
                      credentials: "include",
                      headers: {
                          "Content-Type": "application/json",
                      },
                  });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
        } catch (error) {
            console.error("Error updating privacy setting:", error);
        }
    }
</script>

<svelte:head>
    <title>Prywatność - nexara</title>
    <meta property="og:title" content="Prywatność - nexara" />
</svelte:head>

<div id="wrapper">
    <h1>Prywatność</h1>

    <main id="privacy-settings" class="toggle-parent">
        <div
            class="toggle-container"
            role="switch"
            aria-checked={isEnabled}
            on:click={togglePrivacy}
        >
            <h4 class="toggle-title">
                Ukryj moją tożsamość na publicznej liście członków
            </h4>
            <input
                class="toggle text-base-content"
                type="checkbox"
                checked={isEnabled}
            />
        </div>

        <div class="toggle-description">
            Po włączeniu tej opcji, przestaniesz pojawiać się na
            <a href="/members">publicznej liście członków. </a>
        </div>
    </main>
</div>

<style>
    #wrapper {
        padding: var(--padding);
    }

    #privacy-settings {
        display: flex;
        margin-top: calc(var(--padding));
        justify-content: center;
        align-items: start;
        flex-direction: column;
        border-radius: var(--border-radius);
        font-size: 14px;
    }

    .toggle-parent {
        max-width: 500px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow: hidden;
        transition: opacity 0.2s;
    }

    .toggle-container {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--padding);
        justify-content: space-between;
        border-radius: 100rem;
        cursor: pointer;
    }

    .toggle-description {
        font-size: 14px;
        font-weight: 500;
        color: var(--gray);
        line-height: 1.4;
        white-space: pre-line;
        user-select: text;
        -webkit-user-select: text;
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
