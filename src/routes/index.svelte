<script lang="ts" context="module">
</script>

<script lang="ts">
	import Ticker from '$lib/components/Ticker.svelte';
	import BidCountdown from '$lib/components/BidCountdown.svelte';
	import { score } from '$lib/stores/score';

	let price: number;
</script>

<svelte:head>
	<title>Guess.btc</title>
</svelte:head>

<div class="flex flex-col items-center justify-center w-full h-full space-y-16 text-gray-300">
	<div class="p-4 font-bold text-green-500 rounded-md text-8xl bg-white/10">
		Guess<span class="text-yellow-400">.btc</span>
	</div>

	<div class="flex flex-col items-center p-4 space-y-2 text-white rounded-lg bg-white/10">
		<div class="text-4xl">🏆</div>
		<div>Your Score: {$score}</div>
		<div class="text-sm opacity-50">Predict correctly to win points</div>
	</div>

	<div class="flex flex-col items-center space-y-2">
		<div>Live Bitcoin Price Ticker</div>
		<Ticker bind:price class="text-4xl font-extrabold" prefix="$ " />
	</div>

	<BidCountdown on:success={() => ($score += 1)} {price} countdownTime={5} prefix="$ " />
</div>
