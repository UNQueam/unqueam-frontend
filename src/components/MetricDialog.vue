<template>
  <Dialog v-model:visible="dialogVisible" modal style="width: 80%" @hide="handleClose">
    <div class="card align-items-center">
      <Chart type="line" :data="chartData" :options="chartOptions" class="h-30rem"/>
    </div>
  </Dialog>
</template>

<script setup>

import {onMounted, ref} from 'vue';
import {getMetricTracks, TrackData, TrackingEntity, TrackingType} from "@/service/TrackingService";
import Chart from "primevue/chart";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  gameId: {
    type: Number,
    required: true
  },
  close: {
    type: Function,
    required: true
  }
});

const dialogVisible = ref(props.visible);

/* chart data */
const chartData = ref();
const chartOptions = ref();

const setChartData = (metricsReport) => {
  const documentStyle = getComputedStyle(document.documentElement);

  const results = metricsReport.result

  let metricsLabels = []
  let metrisCount = []

  if (results != null) {
    metricsLabels = Array.from(results).map(result => result.date).sort();
    metrisCount = Array.from(results).sort((a, b) => a.date.localeCompare(b.date)).map(item => item.count);
  }

  return {
    labels: metricsLabels,
    datasets: [
      {
        label: 'Veces jugado',
        data: metrisCount,
        fill: false,
        borderColor: documentStyle.getPropertyValue('--blue-500'),
        tension: 0
      }
    ]
  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          stepSize: 1
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        ticks: {
          color: textColorSecondary,
          stepSize: 1
        },
        grid: {
          color: surfaceBorder
        }
      }
    }
  };
}
/* end chart data */

onMounted(async () => {
  const metricsReport = await getMetricTracks(new TrackData(TrackingEntity.PlayGame, TrackingType.Event, props.gameId));
  chartData.value = setChartData(metricsReport);
  chartOptions.value = setChartOptions();
})

function handleClose() {
  props.close();
  dialogVisible.value = false;
}


</script>

<style scoped>

</style>