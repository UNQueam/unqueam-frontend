<template>
  <Dialog v-model:visible="dialogVisible" header="  " modal style="width: 80%" @hide="handleClose">
    <h1>Métricas de {{props.gameName}}</h1>
    <TabMenu :model="items" class="mb-5"/>
    <div class="card align-items-center">
      <Chart type="line" :data="chartData" :options="chartOptions" class="h-30rem"/>
    </div>
  </Dialog>
</template>

<script setup>

import {onMounted, ref} from 'vue';
import {getMetricTracks, TrackData, TrackingEntity, TrackingType} from "@/service/TrackingService";
import Chart from "primevue/chart";
import TabMenu from "primevue/tabmenu"

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
  },
  gameName: {
    type: String,
    required: true
  }
});

const dialogVisible = ref(props.visible);

/* chart data */
const chartData = ref();
const chartOptions = ref();

const timesPlayedChartData = ref();
const viewsChartData = ref();

const setChartData = (metricsReport, legend, lineColor) => {
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
        label: legend,
        data: metrisCount,
        fill: false,
        borderColor: documentStyle.getPropertyValue(lineColor),
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
  const timesPlayedMetrisReport = await getMetricTracks(new TrackData(TrackingEntity.PlayGame, TrackingType.Event, props.gameId));
  //ChartData starts as with timesPlayed information.
  chartData.value = setChartData(timesPlayedMetrisReport, "Veces Jugado", '--blue-500');
  chartOptions.value = setChartOptions();
  timesPlayedChartData.value = setChartData(timesPlayedMetrisReport, "Veces Jugado", '--blue-500');
  const viewsMetricsReport = await getMetricTracks(new TrackData(TrackingEntity.Game, TrackingType.View, props.gameId));
  viewsChartData.value = setChartData(viewsMetricsReport, "Veces Visitado", '--green-500');
})


function handleClose() {
  props.close();
  dialogVisible.value = false;
}

//Top Menu
const items = ref([
  {
    label: 'Veces jugado',
    icon: 'pi pi-chart-line',
    command: () => {
      chartData.value = timesPlayedChartData.value;
    }
  },
  {
    label: 'Visitas',
    icon: 'pi pi-chart-line',
    command: () => {
      chartData.value = viewsChartData.value;
    }
  }
]);


</script>

<style scoped>
</style>