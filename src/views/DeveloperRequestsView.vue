<script setup>
import {FilterMatchMode, FilterOperator} from 'primevue/api';
import {onBeforeMount, ref} from 'vue';
import DeveloperRequestColorProvider from "@/services/DeveloperRequestColorProvider";
import {fetchRequests, approveRequest,  rejectRequest} from "@/service/DeveloperRequestsService";
import OverlayPanel from 'primevue/overlaypanel';
import {useToast} from "primevue/usetoast";

//Setup

const requests = ref(null);
const filters = ref(null);
const isLoading = ref(true);
const statuses = ref(['Pending', 'Rejected', 'Approved']);
const error = ref(null);
const toast = useToast();
const isProcessingRequest = ref(false);

onBeforeMount(async () => {
  try {
    requests.value = await fetchRequests();
  } catch (err) {
    error.value = err;
  }
  isLoading.value = false;
});

//Toasts
const showRejectSuccess = () => {
  toast.add({ severity: 'success', summary: 'Rechazo realizado', detail: 'Se ha rechazado correctamente la solicitud', life: 5000 });
};

const showFailure = () => {
  toast.add({ severity: 'error', summary: 'Rechazo no realizado', detail: 'Ha habido un error, intente nuevamente', life: 5000 });
};

const showApproveSuccess = () => {
  toast.add({ severity: 'success', summary: 'Solicitud aceptada', detail: 'Se ha aceptado correctamente la solicitud', life: 5000 });
};

// Table data
const DEFAULT_FILTERS = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  issuer_username: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
};

filters.value = DEFAULT_FILTERS;

const clearFilter1 = () => {
  filters.value = DEFAULT_FILTERS;
};

// Approve/ Reject Modal
const rejectedPanel = ref();
const approvedPanel = ref();
const rejectionText = ref("");
const toggleReject = (event) => {
  rejectedPanel.value.toggle(event);
}

const toggleApprove = (event) => {
  approvedPanel.value.toggle(event);
}

const cancelRejectModal = () => {
  rejectionText.value = "";
  toggleReject()
}

const cancelApproveModal = () => {
  toggleApprove()
}

const  sendRejectMessage = async(data) => {
  isProcessingRequest.value = true;
  try {
    await rejectRequest(data.request_id, rejectionText.value);

    requests.value = await fetchRequests()

    rejectionText.value = "";
    toggleReject();
    showRejectSuccess()

  } catch (error) {
    showFailure()
  } finally {
    isProcessingRequest.value = false;
  }
}

const approveDevRequest = async (data) => {
  isProcessingRequest.value = true;
  try {
    await approveRequest(data.request_id);

    requests.value = await fetchRequests();

    showApproveSuccess()

  } catch(error) {
    showFailure()
  } finally {
    isProcessingRequest.value = false;
  }
}

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
          <template #empty>
            <div class="no-requests"> No se encontraron solicitudes. </div>
          </template>
          <template #loading> Cargando las solicitudes. Por favor espera. </template>
          <Column field="request_id" header="#" style="min-width: 2rem">
            <template #body="{ data }">
              {{ data?.request_id }}
            </template>
          </Column>
          <Column field="issuer_username" header="Usuario" style="min-width: 12rem">
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
          <Column dataType="timestamp" header="Fecha" style="min-width: 2rem; max-width: 7rem">
            <template #body="{ data }">
              {{ data?.timestamp }}
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
                <div style="display:flex; justify-content: space-between; align-items: flex-start;" v-if="data?.status === 'PENDING'">

                  <i class="pi pi-times cross clickable-icon mr-3 pt-1" @click="toggleReject" />
                  <OverlayPanel ref="rejectedPanel">
                    <div>
                      <h5>Ingrese la razón por la cuál se está rechazando la solicitud.</h5>
                      <InputText v-model="rejectionText" placeholder="Ingrese la razon del rechazo" type="text" class="w-full" />
                      <div class="flex justify-content-end mt-2">
                        <Button class="p-2 cancel-button" label="Cancelar" type="button" @click="cancelRejectModal"></Button>
                        <Button class="p-2 ml-2" label="Enviar" type="button" style="width: 100px;" @disabled="!rejectionText" @click="sendRejectMessage(data)"></Button>

                      </div>
                    </div>
                  </OverlayPanel>

                  <i class="pi pi-check tick clickable-icon pt-1"  @click="toggleApprove"/>
                  <OverlayPanel ref="approvedPanel">
                    <div>
                      <h5>¿Está seguro que quiere aprobar la solicitud?.</h5>
                      <div class="flex justify-content-end mt-2">
                        <Button class="p-2 cancel-button" label="Cancelar" type="button" @click="cancelApproveModal"></Button>
                        <Button class="p-2 ml-2" label="Aceptar" type="button" style="width: 100px;"  @click="approveDevRequest(data)"></Button>


                      </div>
                    </div>
                  </OverlayPanel>

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
  <Toast position="top-right"/>

</template>

<style lang="scss" scoped>
::v-deep(.p-datatable-frozen-tbody) {
  font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
  font-weight: bold;
}

.clickable-icon {
  cursor: pointer;
  transition: transform 0.3s, color 0.3s;
}

.clickable-icon:hover {
  transform: scale(1.3);
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

.cancel-button {
  width: 100px;
  background-color: rgba(255, 255, 255, 0.87);
  border: none;
  color: #9b2a3a;
  transition: background-color 0.3s, color 0.3s;
}

.cancel-button:hover {
  background-color: rgba(255, 255, 255, 1);
  color: #FF0000;
}

.no-requests {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 18px;
  transition: color 0.3s;
}
</style>
