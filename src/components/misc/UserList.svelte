<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import env from "$lib/env";
    import type { User, ApiResponse } from "$lib/types/api";

    let userList: User[] = [];
    const loading = writable(true);
    const error = writable<string | null>(null);

    function shuffleArray(array: User[]): User[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async function fetchUsers() {
        try {
            const response = await fetch(`${env.api}/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            userList = await response.json();
            userList = shuffleArray(userList);
        } catch (err) {
            error.set(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
        } finally {
            loading.set(false);
        }
    }

    onMount(() => {
        fetchUsers();
    });
</script>

{#if !$loading && !$error}
    {#if userList.length > 0}
        {#each userList as user}
            <div class="user-card">
                <img
                    src={user.avatarUrl}
                    alt="{user.username}'s avatar"
                    class="profile-picture"
                />
                <h2>{user.username}</h2>
            </div>
        {/each}
    {:else}
        <p>No users found.</p>
    {/if}
{/if}

<style>
    .user-card {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: var(--padding);
        text-align: center;
    }

    .user-card img {
        height: 80px;
        width: 80px;
    }
</style>
