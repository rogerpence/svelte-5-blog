<script>
    import Footer from '$lib/components/Footer.svelte';
    import Header from '$lib/components/Header.svelte';

    let { children } = $props();    

    import '../main.css';
</script>

<div class="main-wrapper">
    <Header></Header>

    {@render children()}

    <Footer></Footer>
</div>