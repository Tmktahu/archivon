<script lang="ts">
  import '../app.css';

  import { useRest } from '$lib/models/useRest';
  const { setup } = useRest();
  
  setup();
</script>

<slot />
