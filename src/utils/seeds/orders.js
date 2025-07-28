const orders = [
  {
    customer: '68865fe849bb57a736762c90',
    deliveryDate: '2025-08-01',
    items: [
      {
        productId: '68866c6b29a4743d49adb19e',
        quantity: 2
      },
      {
        productId: '68866c6b29a4743d49adb19d',
        quantity: 1
      }
    ],
    status: 'pending',
    notes: 'Entrega urgente'
  },
  {
    customer: '68865fe849bb57a736762c91',
    deliveryDate: '2025-08-02',
    items: [
      {
        productId: '68866c6b29a4743d49adb19d',
        quantity: 1
      }
    ],
    status: 'delivered',
    notes: 'Cliente prefiere llamada'
  },
  {
    customer: '68865fe849bb57a736762c94',
    deliveryDate: '2025-08-03',
    items: [
      {
        productId: '68866c6b29a4743d49adb1a0',
        quantity: 4
      },
      {
        productId: '68866c6b29a4743d49adb1a9',
        quantity: 2
      }
    ],
    status: 'pending',
    notes: 'Cliente solicita cambio de horario'
  },
  {
    customer: '68865fe849bb57a736762cbe',
    deliveryDate: '2025-08-04',
    items: [
      {
        productId: '68866c6b29a4743d49adb1a8',
        quantity: 3
      }
    ],
    status: 'cancelled',
    notes: 'Cancelado por cliente'
  },
  {
    customer: '68865fe849bb57a736762cbf',
    deliveryDate: '2025-08-05',
    items: [
      {
        productId: '68866c6b29a4743d49adb1a1',
        quantity: 1
      },
      {
        productId: '68866c6b29a4743d49adb1a2',
        quantity: 1
      }
    ],
    status: 'delivered',
    notes: 'Dejar en conserjería'
  },
  {
    customer: '68865fe849bb57a736762cc0',
    deliveryDate: '2025-08-06',
    items: [
      {
        productId: '68866c6b29a4743d49adb1a4',
        quantity: 5
      }
    ],
    status: 'pending',
    notes: ''
  },
  {
    customer: '68865fe849bb57a736762cc1',
    deliveryDate: '2025-08-07',
    items: [
      {
        productId: '68866c6b29a4743d49adb1a5',
        quantity: 2
      },
      {
        productId: '68866c6b29a4743d49adb1a6',
        quantity: 1
      }
    ],
    status: 'pending',
    notes: 'Retraso por tráfico'
  },
  {
    customer: '68865fe849bb57a736762cc3',
    deliveryDate: '2025-08-08',
    items: [
      {
        productId: '68866c6b29a4743d49adb1a7',
        quantity: 3
      }
    ],
    status: 'delivered',
    notes: 'Cliente confirmó recepción'
  },
  {
    customer: '68865fe849bb57a736762cc4',
    deliveryDate: '2025-08-09',
    items: [
      {
        productId: '68866c6b29a4743d49adb1a8',
        quantity: 2
      },
      {
        productId: '68866c6b29a4743d49adb1a9',
        quantity: 2
      }
    ],
    status: 'cancelled',
    notes: 'Paquete dañado, reembolsar'
  },
  {
    customer: '68865fe849bb57a736762cc1',
    deliveryDate: '2025-08-10',
    items: [
      {
        productId: '68866c6b29a4743d49adb1aa',
        quantity: 1
      }
    ],
    status: 'pending',
    notes: 'Producto en promoción'
  },
  {
    customer: '68865fe849bb57a736762cc5',
    deliveryDate: '2025-08-11',
    items: [
      {
        productId: '68866c6b29a4743d49adb1ab',
        quantity: 4
      },
      {
        productId: '68866c6b29a4743d49adb19d',
        quantity: 3
      }
    ],
    status: 'delivered',
    notes: 'Entrega programada'
  },
  {
    customer: '68865fe849bb57a736762cc6',
    deliveryDate: '2025-08-12',
    items: [
      {
        productId: '68866c6b29a4743d49adb19e',
        quantity: 2
      }
    ],
    status: 'pending',
    notes: 'Cliente muy satisfecho'
  },
  {
    customer: '68865fe849bb57a736762c94',
    deliveryDate: '2025-08-13',
    items: [
      {
        productId: '68866c6b29a4743d49adb19f',
        quantity: 1
      },
      {
        productId: '68866c6b29a4743d49adb1a0',
        quantity: 1
      }
    ],
    status: 'pending',
    notes: 'Cliente pidió factura'
  },
  {
    customer: '68865fe849bb57a736762cc7',
    deliveryDate: '2025-08-14',
    items: [
      {
        productId: '68866c6b29a4743d49adb1a1',
        quantity: 2
      }
    ],
    status: 'cancelled',
    notes: ''
  },
  {
    customer: '68865fe849bb57a736762cc9',
    deliveryDate: '2025-08-15',
    items: [
      {
        productId: '68866c6b29a4743d49adb1a6',
        quantity: 3
      },
      {
        productId: '68866c6b29a4743d49adb1a7',
        quantity: 1
      }
    ],
    status: 'delivered',
    notes: 'Reclamo por producto'
  },
  {
    customer: '68865fe849bb57a736762cc8',
    deliveryDate: '2025-08-16',
    items: [
      {
        productId: '68866c6b29a4743d49adb1aa',
        quantity: 1
      }
    ],
    status: 'pending',
    notes: ''
  },
  {
    customer: '68865fe849bb57a736762cca',
    deliveryDate: '2025-08-17',
    items: [
      {
        productId: '68866c6b29a4743d49adb1ab',
        quantity: 5
      },
      {
        productId: '68866c6b29a4743d49adb19e',
        quantity: 2
      }
    ],
    status: 'delivered',
    notes: 'Entrega sin problemas'
  },
  {
    customer: '68865fe849bb57a736762ccb',
    deliveryDate: '2025-08-18',
    items: [
      {
        productId: '68866c6b29a4743d49adb19f',
        quantity: 1
      }
    ],
    status: 'pending',
    notes: ''
  },
  {
    customer: '68865fe849bb57a736762ccc',
    deliveryDate: '2025-08-19',
    items: [
      {
        productId: '68866c6b29a4743d49adb1a4',
        quantity: 2
      },
      {
        productId: '68866c6b29a4743d49adb1a5',
        quantity: 1
      }
    ],
    status: 'cancelled',
    notes: ''
  },
  {
    customer: '68865fe849bb57a736762cc8',
    deliveryDate: '2025-08-20',
    items: [
      {
        productId: '68866c6b29a4743d49adb1a6',
        quantity: 3
      }
    ],
    status: 'delivered',
    notes: 'Cliente quiere seguimiento'
  }
];

module.exports = orders;
