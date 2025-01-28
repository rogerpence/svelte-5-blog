<script lang="ts">
    import {content} from '$lib/data/index-map.ts'
    // import rightArrow from '$lib/images/arrow-right-sm-svgrepo-com.svg'
    //import rightArrow from '$lib/images/arrow-right-sm-svgrepo-com.svg?raw'

    import Icon from '$lib/components/MyIcon.svelte'

    console.log(content)


</script>

<div class="home-page">
    Home page




    {#each content.index_objects as doc}
        <div class="object-item">
            <h2>{doc.title}</h2>
            <p>{doc.description}</p>
            <p class="svg-wrapper"><a href={doc.slug}>Read <Icon/></a></p>

        </div>
    {/each}


    
</div>