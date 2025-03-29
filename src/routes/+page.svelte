<script lang="ts">
  // You can add your JavaScript logic here
</script>

<svelte:head>
  <title>Archivon</title>
  <meta name="description" content="A simple one-page website built with SvelteKit and Tailwind CSS" />
</svelte:head>

<main class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
  <!-- Hero Section -->
  <section class="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
    <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
      Archivon
    </h1>
    <p class="text-xl md:text-2xl max-w-2xl mb-12 text-gray-300">
      A beautifully designed one-page website ready for your creative shenanigans.
    </p>
    <button class="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-medium transition duration-300 transform hover:scale-105">
      Get Started
    </button>
  </section>

  <!-- Features Section -->
  <section class="container mx-auto px-4 py-16">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-gray-800 bg-opacity-50 p-8 rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition duration-300">
        <div class="w-16 h-16 bg-blue-500 rounded-lg mb-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-3">Lightning Fast</h3>
        <p class="text-gray-400">Built with SvelteKit and optimized for performance.</p>
      </div>
      
      <div class="bg-gray-800 bg-opacity-50 p-8 rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition duration-300">
        <div class="w-16 h-16 bg-purple-500 rounded-lg mb-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-3">Beautiful Design</h3>
        <p class="text-gray-400">Styled with Tailwind CSS for a modern, responsive look.</p>
      </div>
      
      <div class="bg-gray-800 bg-opacity-50 p-8 rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition duration-300">
        <div class="w-16 h-16 bg-pink-500 rounded-lg mb-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-3">Customizable</h3>
        <p class="text-gray-400">Ready for your creative shenanigans and custom features.</p>
      </div>
    </div>
  </section>

  <!-- Call to Action Section -->
  <section class="container mx-auto px-4 py-24 text-center">
    <div class="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12">
      <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to add your shenanigans?</h2>
      <p class="text-lg mb-8 opacity-90">This template is just the beginning. Customize it to create something amazing!</p>
      <button class="px-8 py-3 bg-white text-purple-600 hover:bg-gray-100 rounded-full font-medium transition duration-300 transform hover:scale-105">
        Get Started Now
      </button>
    </div>
  </section>

  <!-- Footer -->
  <footer class="container mx-auto px-4 py-8 border-t border-gray-800 mt-12">
    <div class="flex flex-col md:flex-row justify-between items-center">
      <p class="text-gray-400">© {new Date().getFullYear()} Archivon. All rights reserved.</p>
      <div class="flex space-x-4 mt-4 md:mt-0">
        <a href="#" class="text-gray-400 hover:text-white transition">Twitter</a>
        <a href="#" class="text-gray-400 hover:text-white transition">GitHub</a>
        <a href="#" class="text-gray-400 hover:text-white transition">Contact</a>
      </div>
    </div>
  </footer>
</main>

<style>
  /* You can add custom styles here if needed */
</style>
