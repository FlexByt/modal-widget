<script lang="ts">
	export let onBack: () => void;
</script>

<button type="button" class="back-btn" on:click={onBack}
	><svg
		stroke="currentColor"
		fill="currentColor"
		stroke-width="0"
		viewBox="0 0 512 512"
		height="16"
		width="16"
		xmlns="http://www.w3.org/2000/svg"
		><path
			d="M401.4 224h-214l83-79.4c11.9-12.5 11.9-32.7 0-45.2s-31.2-12.5-43.2 0L89 233.4c-6 5.8-9 13.7-9 22.4v.4c0 8.7 3 16.6 9 22.4l138.1 134c12 12.5 31.3 12.5 43.2 0 11.9-12.5 11.9-32.7 0-45.2l-83-79.4h214c16.9 0 30.6-14.3 30.6-32 .1-18-13.6-32-30.5-32z"
		/></svg
	></button
>

<style type="text/scss">
	.back-btn {
		width: 30px;
		line-height: 20px;
		border: 0;
		background-color: #f6f2f2;
		border-radius: 5px;
		padding-top: 5px;
		cursor: pointer;
	}
</style>
