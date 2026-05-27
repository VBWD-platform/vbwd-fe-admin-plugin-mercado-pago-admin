<template>
  <div class="mp-payments">
    <header>
      <h2>{{ $t('mercadoPagoAdmin.payments.title') }}</h2>
      <select v-model="countryFilter">
        <option value="">
          {{ $t('mercadoPagoAdmin.payments.allCountries') }}
        </option>
        <option
          v-for="c in countries"
          :key="c"
          :value="c"
        >
          {{ c }}
        </option>
      </select>
    </header>

    <div v-if="loading">
      {{ $t('mercadoPagoAdmin.payments.loading') }}
    </div>
    <div
      v-else-if="error"
      class="error"
    >
      {{ error }}
    </div>

    <table
      v-else-if="filteredPayments.length > 0"
      class="txtable"
    >
      <thead>
        <tr>
          <th>{{ $t('mercadoPagoAdmin.payments.invoiceNo') }}</th>
          <th>{{ $t('mercadoPagoAdmin.payments.country') }}</th>
          <th>{{ $t('mercadoPagoAdmin.payments.amount') }}</th>
          <th>{{ $t('mercadoPagoAdmin.payments.method') }}</th>
          <th>{{ $t('mercadoPagoAdmin.payments.installments') }}</th>
          <th>{{ $t('mercadoPagoAdmin.payments.status') }}</th>
          <th>{{ $t('mercadoPagoAdmin.payments.mpPaymentId') }}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="p in filteredPayments"
          :key="p.id"
        >
          <td>{{ p.invoice_no }}</td>
          <td>{{ p.country }}</td>
          <td>{{ p.amount }} {{ p.currency }}</td>
          <td>{{ p.method || '—' }}</td>
          <td>{{ p.installments || '—' }}</td>
          <td>
            <span :class="['status', `status--${p.status}`]">{{ p.status }}</span>
          </td>
          <td>{{ p.mp_payment_id || '—' }}</td>
          <td>
            <button
              v-if="p.status === 'completed'"
              class="btn btn--refund"
              @click="onRefund(p)"
            >
              {{ $t('mercadoPagoAdmin.payments.refund') }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-else
      class="empty"
    >
      {{ $t('mercadoPagoAdmin.payments.empty') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import {
  useMercadoPagoStore,
  type MercadoPagoPayment,
} from '../stores/mercadoPago';
import { api } from '@/api';

const countries = ['BR', 'MX', 'AR', 'CO', 'CL', 'UY', 'PE'];

const store = useMercadoPagoStore();
const { filteredPayments, countryFilter, loading, error } = storeToRefs(store);

onMounted(() => {
  store.fetchPayments(api);
});

async function onRefund(p: MercadoPagoPayment) {
  try {
    await store.refund(p.invoice_no, null, api);
    await store.fetchPayments(api);
  } catch (e) {
    window.alert(e instanceof Error ? e.message : 'refund failed');
  }
}
</script>

<style scoped>
.mp-payments { padding: 1.5rem; }
header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.txtable { width: 100%; border-collapse: collapse; }
.txtable th, .txtable td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--vbwd-color-border, #e5e5e5);
  text-align: left;
}
.status--completed { color: var(--vbwd-color-success, #2a7); }
.status--failed,
.status--cancelled { color: var(--vbwd-color-danger, #b22); }
.status--pending,
.status--processing { color: var(--vbwd-color-muted, #888); }
</style>
