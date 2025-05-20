<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { createDialog } from "$lib/state/dialogs";
    import { user } from "$lib/stores/user";

    interface FileUploadResult {
        avatarUrl: string;
    }

    export let id = "file-input";
    export let accept = "image/*";
    export let allowedTypes = ["image/png", "image/jpeg"];
    export let errorMessage = "Proszę wybrać plik PNG lub JPEG (max 5MB)";
    export let uploadUrl = "";
    export let onSuccess: (result: FileUploadResult) => void = () => {};

    const dispatch = createEventDispatcher<{
        error: string;
        success: FileUploadResult;
    }>();

    function isValidFile(file: File): boolean {
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        return allowedTypes.includes(file.type) && file.size <= maxSize;
    }

    function createPreview(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = () => reject(new Error("File reading failed"));
            reader.readAsDataURL(file);
        });
    }

    async function uploadFile(
        file: File,
        previewUrl: string
    ): Promise<FileUploadResult> {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await fetch(uploadUrl, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Upload failed");
        }

        const text = await response.text();
        return text ? JSON.parse(text) : { avatarUrl: previewUrl };
    }

    function handleClick() {
        document.getElementById(id)?.click();
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleClick();
        }
    }

    async function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        input.value = "";

        if (!isValidFile(file)) {
            createDialog({
                type: "base",
                id: "error",
                description: errorMessage,
                title: "Oopsie daisy!",
            });
            return;
        }

        try {
            const previewUrl = await createPreview(file);

            const result = await uploadFile(file, previewUrl);

            user.update((currentUser) =>
                currentUser
                    ? { ...currentUser, avatarUrl: result.avatarUrl }
                    : currentUser
            );

            onSuccess(result);
            window.location.reload();
        } catch (error) {
            const errorMsg = "Nie udało się zaktualizować zdjęcia profilowego";
            createDialog({
                type: "base",
                id: "error",
                description: errorMsg,
                title: "Oopsie daisy!",
            });
            console.error("Upload error:", error);
        }
    }
</script>

<div
    class="file-receiver"
    on:click={handleClick}
    on:keydown={handleKeyDown}
    role="button"
    tabindex="0"
>
    <slot />
    <input
        type="file"
        {id}
        {accept}
        on:change={handleFileSelect}
        style="display: none;"
    />
</div>

<style>
    .file-receiver {
        cursor: pointer;
        display: contents;
    }
</style>
