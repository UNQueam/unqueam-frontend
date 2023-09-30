<script setup>
import {FilterMatchMode, FilterOperator} from 'primevue/api';
import {onBeforeMount, ref} from 'vue';
import UserSeverityColorProvider from "@/services/UserSeverityColorProvider";
import {fetchUsers} from "@/service/UsersService";

const users = ref(null);
const filters = ref(null);
const isLoading = ref(true);
const roles = ref(['Admin', 'Developer', 'User']);
const error = ref(null);

filters.value = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  username: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
  role: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
};

onBeforeMount(async () => {
  try {
    users.value = await fetchUsers();
  } catch (err) {
    error.value = err;
  }
  isLoading.value = false;
});

const initfilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    username: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    created_at: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    role: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
  };
};

const clearFilter1 = () => {
  initfilters();
};
</script>

<template>
  <div class="flex">
    <div class="m-auto mt-5 col-12 md:col-11 lg:col-8">
      <div class="card">
        <h5>Usuarios</h5>
        <DataTable
            v-model:filters="filters"
            :filters="filters"
            :globalFilterFields="['user_id', 'username', 'role']"
            :loading="isLoading"
            :paginator="true"
            :rowHover="true"
            :rows="10"
            :value="users"
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
          <template #empty> No se encontraron usuarios. </template>
          <template #loading> Cargando informacion de usuarios. Por favor espera. </template>
          <Column field="user_id" header="#" style="min-width: 2rem">
            <template #body="{ data }">
              {{ data?.user_id }}
            </template>
          </Column>
          <Column field="username" header="Usuario" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data?.username }}
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by username" type="text" />
            </template>
          </Column>
          <Column field="email" header="Email" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data?.email }}
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by email" type="text" />
            </template>
          </Column>
          <Column :filterMenuStyle="{ width: '14rem' }" field="role" header="Role" style="min-width: 2rem">
            <template #body="{ data }">
              <div>
                <Tag
                    :class="'mr-2'"
                    :rounded="true"
                    :severity="UserSeverityColorProvider.getForRole(data?.role)"
                    :value="data?.role"
                ></Tag>
              </div>
            </template>
            <template #filter="{ filterModel }">
              <Dropdown v-model="filterModel.value" :options="roles" :showClear="true" class="p-column-filter" placeholder="Any">
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
          <Column dataType="created_at" filterField="created_at" header="Registro" style="min-width: 2rem; max-width: 7rem">
            <template #body="{ data }">
              {{ data?.created_at }}
            </template>
            <template #filter="{ filterModel }">
              <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
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
</style>
