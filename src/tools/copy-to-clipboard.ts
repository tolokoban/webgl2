export async function copyToClipboard(code: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(code)
    } catch (ex) {
        console.error("Unable to copy to the clipboard:", ex)
    }
}
