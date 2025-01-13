<script lang="ts">
      import { onMount } from 'svelte';
      import Toaster from '$lib/components/Toaster.svelte';


      let toasterRef: { showToast: (message: string) => void };

    // function cancelAnimation(element: HTMLElement | null) {
    //     if (!element) return;
    //     element.target.style.animation = 'none';
    //     element.target.style.opacity = '0';        
    //     console.log('clicked')       
    // }      

    function animateElement(element: Element, className: string) {
        element.classList.add(className);
        element.addEventListener('animationend', () => {
            element.classList.remove(className);
        }, { once: true });
    }

    function isDarkColor(rgb:string) {
        // Extract RGB values
        const [r, g, b] = rgb.match(/\d+/g)?.map(Number) ?? [];
        // Calculate luminance
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        return luminance < 0.5; // Dark if luminance is less than 0.5
    }

    function adjustTextColorBasedOnBackground(element: Element) {
        const computedStyle = window.getComputedStyle(element);
        const backgroundColor = computedStyle.backgroundColor;

        if (isDarkColor(backgroundColor)) {
            return 'hsl(24, 6%, 83%)'; // Lighten text color
        } else {
            return 'black'; // Darken text color
            //element.style.color = 'black'; // Default to black for light backgrounds
        }
    }

    function getElementProperties(element: Element) {
        const result = {
            bg: '',
            class: ''
        }

        const cls = element.classList[0] ?? ''

        const root = getComputedStyle(document.documentElement)
        const hsl = root.getPropertyValue(`--${cls}`)

        if (!hsl) return result;
        return {
            bg: hsl,
            class: cls
        }
    }

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    }

    function rgbToHex(rgb: string) : string{
        const result: RegExpMatchArray | null = rgb.match(/\d+/g); // Extract the numeric values
        if (!result) return '';
        const r = parseInt(result[0], 10).toString(16).padStart(2, '0');
        const g = parseInt(result[1], 10).toString(16).padStart(2, '0');
        const b = parseInt(result[2], 10).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }

    function showCopiedText(value: string) {
        const copied = document.querySelector('.copied') as HTMLElement;
        copied.innerHTML = `${value} copied to clipboard`; 
        copied.style.animation = 'none';
        copied.offsetHeight; // Trigger reflow
        copied.style.animation = 'fadeIn 0.6s forwards, fadeOut 0.6s forwards 2s';        
    }

    onMount(() => {
        const colorDivs = document.querySelectorAll('div.color-guide div');
        colorDivs.forEach(div => {
            const { bg, class: className } = getElementProperties(div);
            // console.log('bg', bg + ' ' + className);
            const bgColor = adjustTextColorBasedOnBackground(div);
            div.innerHTML = `<div data-class="${className}" class="class-value pointer" style="color:${bgColor}">${className}</div>` +
                            `<div data-hex="${bg}" class="hex-value pointer"   style="color:${bgColor}">${bg}</div>`;
        });

        const classNames = document.querySelectorAll('.class-value');
        classNames.forEach(value => {
            value.addEventListener('click', () => {
                navigator.clipboard.writeText(value.getAttribute('data-class') ?? '');
                //showCopiedText(value.getAttribute('data-class') ?? '');                
                animateElement(value.parentElement as Element, 'animation-shake-z');
                toasterRef.showToast(value.getAttribute('data-class') ?? '');
            });
        });

        const colorValues = document.querySelectorAll('.hex-value');
        colorValues.forEach(value => {
            value.addEventListener('click', () => {
                navigator.clipboard.writeText(value.getAttribute('data-hex') ?? '');
                copyToClipboard(value.getAttribute('data-hex') + ";");
                //showCopiedText(value.getAttribute('data-hex') ?? '');
                animateElement(value.parentElement as Element, 'animation-shake-z');
                toasterRef.showToast(value.getAttribute('data-hex') ?? '');
            });
        });
  });

</script>

<Toaster bind:this={toasterRef} />

<!-- <div class="copied" aria-role="button" onclick={cancelAnimation}></div> -->

<div class="design-colors">
    <section>
        <h2>Background colors</h2>
        <div class="color-guide">
            <div class="background-light"></div>
            <div class="background-dark"></div>
        </div>

        <h2>Brand colors</h2>
        <div class="color-guide">
            <div class="brand-primary"></div>
            <div class="brand-complimentary"></div>
            <div class="brand-highlight"></div>
            <div class="brand-neutral-100"></div>
            <div class="brand-neutral-200"></div>
        </div>

        <h2>Accent colors (hover over to show hover color)</h2>
        <div class="color-guide">
            <div class="accent-100"></div>
            <div class="accent-200"></div>
            <div class="accent-300"></div>
        </div>

        <h2>Secondary colors</h2>
        <div class="color-guide">
            <div class="secondary-100"></div>
            <div class="secondary-200"></div>
            <div class="secondary-300"></div>
            <div class="secondary-400"></div>
            <div class="secondary-500"></div>
        </div>

        <h2>State colors (hover over to show hover color)</h2>
        <div class="color-guide">
            <div class="state-info"></div>
            <div class="state-danger"></div>
            <div class="state-caution"></div>
            <div class="state-ok"></div>
        </div>

        <h2>Text colors</h2>
        <div class="color-guide">
            <div class="neutral-100"></div>
            <div class="neutral-200"></div>
            <div class="neutral-300"></div>
            <div class="neutral-400"></div>
            <div class="neutral-500"></div>
        </div>
    </section>
</div>


