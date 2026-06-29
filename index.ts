import type { IPlugin, IPlatformSDK } from 'vbwd-view-component';

export const mercadoPagoAdminPlugin: IPlugin = {
  name: 'mercado-pago-admin',
  version: '26.6.1',
  description:
    'Mercado Pago admin — payments list + per-country filter + refund',

  install(sdk: IPlatformSDK) {
    sdk.addRoute({
      path: 'mercado-pago/payments',
      name: 'mercado-pago-payments',
      component: () => import('./src/views/MercadoPagoPayments.vue'),
      meta: { requiredPermission: 'payments.configure' },
    });
  },

  activate() {},
  deactivate() {},
};
