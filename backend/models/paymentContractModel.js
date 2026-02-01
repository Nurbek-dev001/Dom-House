import mongoose from 'mongoose';

const paymentContractSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    propertyTitle: {
      type: String,
      required: true
    },
    propertyAddress: {
      type: String,
      required: true
    },
    tenantName: {
      type: String,
      required: true
    },
    tenantEmail: {
      type: String,
      required: true
    },
    tenantPhone: {
      type: String,
      required: true
    },
    contractType: {
      type: String,
      enum: ['sale', 'rent'],
      default: 'sale',
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    // Optional sale-specific fields
    saleDate: {
      type: Date
    },
    saleTerms: {
      type: [String],
      default: [
        'Покупатель обязуется оплатить полную стоимость недвижимости до подписания акта приема-передачи.',
        'Стороны подтверждают отсутствие задолженностей и обременений на объект недвижимости.',
        'Передача права собственности осуществляется после полной оплаты и подписания акта приема-передачи.',
        'Все налоги и сборы, связанные с переходом права собственности, оплачиваются согласно законодательству РК.',
        'Договор купли-продажи вступает в силу с момента подписания обеими сторонами.',
        'Продавец гарантирует юридическую чистоту объекта недвижимости.',
        'Покупатель ознакомлен с техническим состоянием объекта и не имеет претензий.'
      ]
    },
    // Optional rental-specific fields
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    contractDays: {
      type: Number
    },
    securityDeposit: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['draft', 'signed', 'completed', 'cancelled'],
      default: 'draft'
    },
    sellerSignedAt: {
      type: Date,
      default: null
    },
    buyerSignedAt: {
      type: Date,
      default: null
    },
    pdfUrl: {
      type: String,
      default: null
    },
    paymentDetails: {
      amount: {
        type: Number
      },
      currency: {
        type: String,
        default: '₸'
      },
      paymentMethod: {
        type: String,
        enum: ['cash', 'bank_transfer', 'card', 'pending'],
        default: 'pending'
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
      }
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const PaymentContract = mongoose.model('PaymentContract', paymentContractSchema);

export default PaymentContract;
