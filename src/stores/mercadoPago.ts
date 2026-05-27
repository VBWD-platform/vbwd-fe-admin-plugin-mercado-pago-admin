import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface MercadoPagoPayment {
  id: string;
  invoice_no: string;
  country: string;
  preference_id: string | null;
  mp_payment_id: string | null;
  method: string | null;
  amount: string;
  currency: string;
  installments: number | null;
  status: string;
  last_provider_status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/** Minimal surface of the host's ``@/api`` ApiClient — promise-returning,
    already-parsed body. Each plugin types its store against this so the
    view can pass ``api`` from the host without TS complaints. */
interface ApiClientLike {
  get<T = unknown>(url: string, config?: unknown): Promise<T>;
  post<T = unknown>(url: string, body?: unknown, config?: unknown): Promise<T>;
}

export const useMercadoPagoStore = defineStore('mercado-pago-admin', () => {
  const payments = ref<MercadoPagoPayment[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const countryFilter = ref<string>('');

  const filteredPayments = computed(() => {
    if (!countryFilter.value) return payments.value;
    return payments.value.filter((p) => p.country === countryFilter.value);
  });

  async function fetchPayments(api: ApiClientLike) {
    loading.value = true;
    error.value = null;
    try {
      const body = await api.get<{ payments: MercadoPagoPayment[] }>('/api/v1/plugins/mercado-pago/payments');
      payments.value = body.payments || [];
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load';
    } finally {
      loading.value = false;
    }
  }

  async function refund(
    invoiceNo: string,
    amount: number | null,
    api: ApiClientLike,
  ) {
    return api.post(
      `/api/v1/plugins/mercado-pago/payments/${invoiceNo}/refund`,
      amount !== null ? { amount } : {},
    );
  }

  return {
    payments,
    filteredPayments,
    countryFilter,
    loading,
    error,
    fetchPayments,
    refund,
  };
});
