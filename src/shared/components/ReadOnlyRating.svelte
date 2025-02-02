<script lang="ts">
  import { ReadOnlyRatingSize } from "../../types";
  import BigStar from "./BigStar.svelte";
  import SmallStar from "./SmallStar.svelte";

  export let rating: number;
  export let starColor: string;
  export let size: ReadOnlyRatingSize;
</script>

{#each Array(rating) as _}
  {#if size === ReadOnlyRatingSize.BIG}
    <BigStar color={starColor} />
  {:else}
    <SmallStar color={starColor} />
  {/if}
{/each}

{#each Array(5 - rating) as _}
  {#if size === ReadOnlyRatingSize.BIG}
    <BigStar color="#999999" />
  {:else}
    <SmallStar color="#999999" />
  {/if}
{/each}
