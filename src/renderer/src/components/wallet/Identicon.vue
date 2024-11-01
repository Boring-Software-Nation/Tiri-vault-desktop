<template>
  <svg viewBox="0 0 5 5" class="identicon">
    <g>
      <rect width="5" height="5" x="0" y="0" :fill="background" />
      <rect v-for="(cell, i) in cells" :key="i" width="1" height="1" :x="cell[0]" :y="cell[1]" :fill="foreground" shape-rendering="crispEdges" />
    </g>
  </svg>
</template>

<script lang="ts">
export default {
  name: 'Identicon',
};
</script>


<script setup lang="ts">
  import { hash } from 'tweetnacl';
  import { encode as encodeUTF8 } from '@stablelib/utf8';
  import { computed, onMounted, ref, watch } from 'vue';

  const props = defineProps<{
    value: string
  }>();

  const hashValue = ref(hash(encodeUTF8('')));

  const hue = computed(() => {
    return (hashValue.value[60] + hashValue.value[61] + hashValue.value[62] + hashValue.value[63]) % 360;
  });

  const foreground = computed(() => {
    return `hsl(${hue.value}, 70%, 40%)`;
  });

  const background = computed(() => {
    return `hsl(${(hue.value + 240) % 360}, 70%, 40%)`;
  });

  const cells = computed(() => {
    const cells = [] as number[][];
    const size = 5;
    const c = Math.ceil(size / 2);

    for (let i = 0; i < 15; i++) {
      const x = Math.floor(i / size);
      const y = i % size;
      const mx = size - x - 1;
      const pos = x + y * c;

      if ((hashValue.value[Math.floor(pos / 8)] & (1 << (7 - pos % 8))) !== 0) {
        cells.push([x, y], [mx, y]);
      }
    }

    return cells;
  });

  watch(() => props.value, (val) => {
    hashValue.value = hash(encodeUTF8(val));
  });

  onMounted(() => {
    hashValue.value = hash(encodeUTF8(props.value));
  });

</script>
