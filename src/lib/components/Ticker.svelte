<script lang="ts">
	import { onMount } from 'svelte';

	export let price = 0;
	export let history: number[] = [];
	export let symbol = 'BTC-USD';
	export let prefix = '';

	let server: WebSocket;
	let lastPrice = 0;

	$: isUp = price > lastPrice;

	function monitor(symbol: string) {
		server = new WebSocket('wss://ws-feed.pro.coinbase.com');
		server.onopen = () => {
			server.send(
				JSON.stringify({
					type: 'subscribe',
					channels: [{ name: 'ticker', product_ids: [symbol] }]
				})
			);
		};

		server.onmessage = (evt: MessageEvent) => {
			updateTickerPrice(JSON.parse(evt.data));
		};
	}

	async function unmonitor(symbol: string) {
		await server.send(
			JSON.stringify({
				type: 'unsubscribe',
				channels: [{ name: 'ticker', product_ids: [symbol] }]
			})
		);
		server.close();
	}

	async function updateTickerPrice(data: any) {
		lastPrice = price;
		price = Number(data.price);
	}

	onMount(() => {
		monitor(symbol);
		return () => unmonitor(symbol);
	});
</script>

<ticker class="{$$props.class || ''} {isUp ? 'text-green-500' : 'text-red-500'} flex space-x-2 ">
	<span>
		{prefix}{price.toFixed(2)}
	</span>
	<span>
		{#if isUp}
			↑
		{:else}
			↓
		{/if}
	</span>
</ticker>
