<script lang="ts">
	export let id: string;
	export let reviewRating: number;
	export let changeRating: (value: number) => void;

	const handleChange = (e: Event) => {
		const target = e.target as HTMLButtonElement;

		if (target) {
			changeRating(Number(target.value));
		}
	};
</script>

<div class="reviews-jet-rate">
	<input type="radio" id={`${id}-5`} name="rate" value="5" checked={reviewRating === 5} on:change={handleChange} />
	<label for={`${id}-5`} />
	<input type="radio" id={`${id}-4`} name="rate" value="4" checked={reviewRating === 4} on:change={handleChange} />
	<label for={`${id}-4`} />
	<input type="radio" id={`${id}-3`} name="rate" value="3" checked={reviewRating === 3} on:change={handleChange} />
	<label for={`${id}-3`} />
	<input type="radio" id={`${id}-2`} name="rate" value="2" checked={reviewRating === 2} on:change={handleChange} />
	<label for={`${id}-2`} />
	<input type="radio" id={`${id}-1`} name="rate" value="1" checked={reviewRating === 1} on:change={handleChange} />
	<label for={`${id}-1`} />
</div>

<style type="text/scss">
	.reviews-jet-rate {
		display: flex;
		gap: 3px;
		flex-direction: row-reverse;
	}
	.reviews-jet-rate label {
		padding: 0px;
	}
	.reviews-jet-rate:not(:checked) > input {
		position: absolute;
		display: none;
	}
	.reviews-jet-rate:not(:checked) > label {
		float: right;
		overflow: hidden;
		white-space: nowrap;
		cursor: pointer;
		font-size: 20px;
		color: #ccc;
		line-height: 40px;
	}
	.reviews-jet-rate:not(:checked) > label:before {
		content: '★';
	}
	.reviews-jet-rate > input:checked ~ label {
		color: #ffc700;
		line-height: 40px;
	}
	.reviews-jet-rate:not(:checked) > label:hover,
	.reviews-jet-rate:not(:checked) > label:hover ~ label {
		color: #deb217;
	}
	.reviews-jet-rate > input:checked + label:hover,
	.reviews-jet-rate > input:checked + label:hover ~ label,
	.reviews-jet-rate > input:checked ~ label:hover,
	.reviews-jet-rate > input:checked ~ label:hover ~ label,
	.reviews-jet-rate > label:hover ~ input:checked ~ label {
		color: #c59b08;
	}
</style>
