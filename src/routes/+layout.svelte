<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="w-full min-h-screen bg-gray-400">
	<div class="grid place-items-center w-full">
		<div class="max-w-xl w-full">
			{@render children()}
		</div>
	</div>
</div>
