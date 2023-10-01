<script setup>
import {FilterMatchMode, FilterOperator} from 'primevue/api';
import {onBeforeMount, ref} from 'vue';
import DeveloperRequestColorProvider from "@/services/DeveloperRequestColorProvider";
import {fetchRequests} from "@/service/DeveloperRequestsService";

const requests = ref(null);
const filters = ref(null);
const isLoading = ref(true);
const statuses = ref(['Pending', 'Rejected', 'Approved']);
const error = ref(null);

const DEFAULT_FILTERS = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  username: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  timestamp: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
  status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
};

filters.value = DEFAULT_FILTERS;

onBeforeMount(async () => {
  try {
    requests.value = await fetchRequests();
  } catch (err) {
    error.value = err;
  }
  isLoading.value = false;
});

const clearFilter1 = () => {
  filters.value = DEFAULT_FILTERS;
};
</script>

<template>
  <div class="flex">
    <div class="m-auto mt-5 col-12 md:col-11 lg:col-8">
      <div class="card">
        <h5>Solicitudes para ser desarrollador</h5>
        <DataTable
            v-model:filters="filters"
            :filters="filters"
            :globalFilterFields="['request_id', 'issuer_username', 'status']"
            :loading="isLoading"
            :paginator="true"
            :rowHover="true"
            :rows="10"
            :value="requests"
            class="p-datatable-gridlines"
            dataKey="id"
            filterDisplay="menu"
            responsiveLayout="scroll"
        >
          <template #header>
            <div class="flex justify-content-between flex-column sm:flex-row">
              <Button class="p-button-outlined mb-2" icon="pi pi-filter-slash" label="Quitar filtros" type="button" @click="clearFilter1()" />
              <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters.global.value" placeholder="Buscar ..." style="width: 100%" />
              </span>
            </div>
          </template>
          <template #empty> No se encontraron solicitudes. </template>
          <template #loading> Cargando las solicitudes. Por favor espera. </template>
          <Column field="request_id" header="#" style="min-width: 2rem">
            <template #body="{ data }">
              {{ data?.request_id }}
            </template>
          </Column>
          <Column field="username" header="Usuario" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data?.issuer_username }}
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by username" type="text" />
            </template>
          </Column>
          <Column field="reason" header="Razon" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data?.reason }}
            </template>
          </Column>
          <Column dataType="timestamp" filterField="timestamp" header="Fecha" style="min-width: 2rem; max-width: 7rem">
            <template #body="{ data }">
              {{ data?.timestamp }}
            </template>
            <template #filter="{ filterModel }">
              <Calendar v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="dd/mm/yy" />
            </template>
          </Column>
          <Column :filterMenuStyle="{ width: '14rem' }" field="status" header="Status" style="min-width: 2rem">
            <template #body="{ data }">
              <div style="display:flex; justify-content: space-between; align-items: flex-start">
                <Tag
                    :class="'mr-2'"
                    :rounded="true"
                    :severity="DeveloperRequestColorProvider.getForStatus(data?.status)"
                    :value="data?.status"
                ></Tag>
                <div style="display:flex; justify-content: space-between; align-items: flex-start" v-if="data?.status === 'PENDING'">
                  <i class="pi pi-check mr-3 tick clickable-icon"  />
                  <i class="pi pi-times cross clickable-icon" />
                </div>
              </div>
            </template>
            <template #filter="{ filterModel }">
              <Dropdown v-model="filterModel.value" :options="statuses" :showClear="true" class="p-column-filter" placeholder="Any">
                <template #value="slotProps">
                  <span v-if="slotProps.value" :class="'customer-badge'">{{ slotProps.value }}</span>
                  <span v-else>{{ slotProps.placeholder }}</span>
                </template>
                <template #option="slotProps">
                  <span :class="'customer-badge'">{{ slotProps.option }}</span>
                </template>
              </Dropdown>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
::v-deep(.p-datatable-frozen-tbody) {
  font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
  font-weight: bold;
}

.clickable-icon {
  cursor: pointer; /* Cambia el cursor al pasar el ratón por encima para indicar que es clickeable. */
  transition: transform 0.3s, color 0.3s; /* Agrega transiciones de transformación y color suaves al pasar el ratón por encima. */
}

.clickable-icon:hover {
  transform: scale(1.3); /* Aumenta el tamaño al pasar el ratón por encima. Puedes ajustar el valor para controlar el grado de agrandamiento. */
}

.tick {
  color: #00A65A;
}

.tick:hover {
  color: #00C378;
}

.cross {
  color: #E74C3C;
}

.cross:hover {
  color: #FF6654;
}
</style>
