<script lang="ts" context="module">
	type Bid = {
		placedAt: number;
		is: 'up' | 'down';
		resultPrice?: number;
		result?: 'win' | 'lose' | 'nochange';
	};
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let countdownTime: number;
	export let prefix: string;
	export let price: number;
	export let bid: Bid | undefined = undefined;

	const dispatch = createEventDispatcher<{ success: void }>();

	let countdown = countdownTime;
	let timer: any;
	const commonBtnClasses =
		'px-8 py-2 font-bold text-white transition-all duration-200 rounded-lg shadow-lg';

	function placeBid(type: 'up' | 'down') {
		bid = {
			placedAt: +price,
			is: type
		};
		countdown = countdownTime;
		timer = setInterval(() => {
			countdown -= 1;
		}, 1000);
	}

	function reset() {
		countdown = countdownTime;
		bid = undefined;
	}

	$: {
		if (countdown == 0 && !bid?.resultPrice) {
			clearInterval(timer);
			timer = undefined;
			if (bid) {
				bid.resultPrice = +price;
				if (
					(bid.is === 'up' && bid.resultPrice > bid.placedAt) ||
					(bid.is === 'down' && bid.resultPrice < bid.placedAt)
				) {
					bid.result = 'win';
					dispatch('success');
				} else if (bid.resultPrice == bid.placedAt) {
					bid.result = 'nochange';
				} else bid.result = 'lose';
			}
		}
	}

	$: console.log('bid placed at:', bid?.placedAt, 'result price', bid?.resultPrice);
</script>

<place-bids class="flex flex-col items-center space-y-4">
	<div>
		Predict whether the price will go up or down in the next <span class="font-bold underline">
			{countdownTime} seconds
		</span>
	</div>
	<div class="flex space-x-6">
		{#if bid && typeof bid.resultPrice !== 'undefined'}
			<div class="flex flex-col items-center p-4 space-y-8 rounded-lg bg-slate-700">
				{#if bid.result === 'win'}
					<div class="text-5xl font-bold text-green-400">You won 😎</div>
				{:else if bid.result === 'nochange'}
					<div class="text-5xl font-bold text-white-400">No change in price! Try again 😶</div>
				{:else}
					<div class="text-5xl font-bold text-red-400">You lost 😢</div>
				{/if}
				<button
					on:click={reset}
					class="{commonBtnClasses} bg-yellow-600 shadow-yellow-800 hover:bg-yellow-700 active:bg-yellow-500"
				>
					Place another bid
				</button>
			</div>
		{:else if bid}
			<div class="flex flex-col items-center p-4 space-y-2 rounded-lg bg-slate-700">
				<div class="text-2xl font-bold text-yellow-400">Bid Placed! 🎉</div>
				<div class="underline">Your Bid details:</div>
				<div>
					You predicted that in <span class="font-bold">{countdown} seconds</span> the BTC coin
					price will be <span class="font-bold">{bid.is === 'up' ? 'more' : 'less'}</span> than
					<span class="font-bold">{prefix}{bid.placedAt}</span>
				</div>
				<div class="text-sm opacity-50">(Please wait for the countdown to place another bid)</div>
			</div>
		{:else}
			<button
				on:click={() => placeBid('down')}
				class="{commonBtnClasses} bg-red-600 shadow-red-800 hover:bg-red-700 active:bg-red-500"
			>
				Down 📉
			</button>
			<button
				on:click={() => placeBid('up')}
				class="{commonBtnClasses} bg-green-600 shadow-green-800 hover:bg-green-700 active:bg-green-500"
			>
				Up 📈
			</button>
		{/if}
	</div>
</place-bids>
