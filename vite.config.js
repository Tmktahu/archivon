import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: '0.0.0.0', // This makes the server accessible from any network interface
		port: 5173 // Default port, you can change if needed
	}
});
