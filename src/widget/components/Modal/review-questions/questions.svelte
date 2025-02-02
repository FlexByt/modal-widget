<script lang="ts">
	export let title: string;
	export let questions: string[];
	export let status: boolean;
	export let borderColor: string;
</script>

<div class="wrapper">
	{#if !!status && !!questions?.length}
		<span class="questions">
			{title}
			<div style={`border-color: ${borderColor}`} />
		</span>
		{#if !!questions.length}
			<ul>
				{#each questions as question}
					<li>{question}</li>
				{/each}
			</ul>
		{/if}
	{/if}
</div>

<style type="text/scss">
	div.wrapper {
		width: 100%;
		span.questions {
			width: 100%;
			font-size: 14px;
			margin-top: 15px;
			div {
				border-bottom: 3px solid;
				width: 40px;
				margin-top: 5px;
				margin-bottom: 15px;
			}
		}
		ul {
			margin-top: 5px;
			list-style: disc;
			width: 100%;
			padding-left: 15px;

			li {
				padding: 2px 0;
				color: #707d86;
				font-size: 15px;
			}
		}
	}
</style>
