<script lang="ts">

    let { data } = $props()
   
    </script>

<div class="two-col-body">
    <div>
        <aside> 
            This is the aside
        </aside>    
        <article class="article">
            <h1>{data.meta.title}</h1>
            <data.content />
        </article>    
    </div>
</div>    
    