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

export const useMercadoPagoStore = defineStore('mercado-pago-admin', () => {
  const payments = ref<MercadoPagoPayment[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const countryFilter = ref<string>('');

  const filteredPayments = computed(() => {
    if (!countryFilter.value) return payments.value;
    return payments.value.filter((p) => p.country === countryFilter.value);
  });

  async function fetchPayments(api: { get: typeof fetch }) {
    loading.value = true;
    error.value = null;
    try {
      const resp = await api.get('/api/v1/plugins/mercado-pago/payments');
      const body = await resp.json();
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
    api: {
      post: (url: string, body: unknown) => Promise<Response>;
    },
  ) {
    const resp = await api.post(
      `/api/v1/plugins/mercado-pago/payments/${invoiceNo}/refund`,
      amount !== null ? { amount } : {},
    );
    if (!resp.ok) {
      throw new Error(`refund failed: ${resp.status}`);
    }
    return resp.json();
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
