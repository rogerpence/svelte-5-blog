
<script lang="ts">

    let textValue = $state('')
    let selfRef: HTMLDivElement;

    export const showToast = (text: string) => {
        textValue = text;

        selfRef.style.animation = 'none';
        selfRef.offsetHeight; // Trigger reflow
        selfRef.style.animation = 'fadeIn 0.6s forwards, fadeOut 0.6s forwards 2s';        
    }

    function cancelAnimation(element: HTMLButtonElement | null) {
        if (!element) return;
        selfRef.style.animation = 'none';
        selfRef.style.opacity = '0';        
    }      
</script>

<div bind:this={selfRef} class="toaster toaster-center-top">
    <button onclick={cancelAnimation}>{textValue}<br>
        <span style="font-size: .8rem;">copied to clipboard</span></button>    
</div>

