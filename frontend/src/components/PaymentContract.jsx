import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check, Calendar, DollarSign, FileText, AlertCircle, X } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import axios from 'axios';
import { Backendurl } from '../App.jsx';

const PaymentContract = ({ property, onClose }) => {
  // Для купли-продажи не нужны планы аренды
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tenantName, setTenantName] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [showTenantForm, setShowTenantForm] = useState(false);

  const totalPrice = property.price;

  const saleTerms = [
    'Покупатель обязуется оплатить полную стоимость недвижимости до подписания акта приема-передачи.',
    'Стороны подтверждают отсутствие задолженностей и обременений на объект недвижимости.',
    'Передача права собственности осуществляется после полной оплаты и подписания акта приема-передачи.',
    'Все налоги и сборы, связанные с переходом права собственности, оплачиваются согласно законодательству РК.',
    'Договор купли-продажи вступает в силу с момента подписания обеими сторонами.',
    'Продавец гарантирует юридическую чистоту объекта недвижимости.',
    'Покупатель ознакомлен с техническим состоянием объекта и не имеет претензий.'
  ];

  // Determine contract flow: rent vs buy
  const availabilityFlag = String(property?.availability || property?.type || '').toLowerCase();
  const isRent = availabilityFlag.includes('rent');

  // Plans for rent vs buy
  const rentPlans = [
    { id: 'monthly', label: 'Monthly', price: property?.price || 0, days: 30, features: ['Month-to-month rental'] },
    { id: 'quarter', label: 'Quarterly', price: Math.round((property?.price || 0) * 3), days: 90, features: ['3 months commitment'] },
    { id: 'year', label: 'Yearly', price: Math.round((property?.price || 0) * 12), days: 365, features: ['Best value'] }
  ];

  const salePlans = [
    { id: 'full', label: 'Full Payment', price: property?.price || 0, days: 1, features: ['Full payment on signing'] },
    { id: 'installments', label: 'Installments (30 days)', price: Math.round(property?.price || 0), days: 30, features: ['Payment schedule available'] }
  ];

  const plans = isRent ? rentPlans : salePlans;

  const [selectedPlan, setSelectedPlan] = useState(plans[0].id);
  const selectedPlanData = plans.find(p => p.id === selectedPlan) || plans[0];
  const monthlyPrice = isRent ? Math.round(property?.price || 0) : Math.round(property?.price || 0);
  const livingRules = property?.livingRules || [
    'No loud music after 22:00',
    'Do not sublet without permission',
    'No smoking inside the property',
    'Keep the property clean',
    'Report major damages to landlord'
  ];

  const handleDownloadContract = () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions before downloading');
      return;
    }

    const contractContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #0891b2;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #0891b2;
            margin: 0;
          }
          .contract-title {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
            color: #000;
          }
          .section {
            margin: 20px 0;
            padding: 15px;
            border-left: 4px solid #0891b2;
            background-color: #f0f9ff;
          }
          .section h2 {
            color: #0891b2;
            margin-top: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          td, th {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #0891b2;
            color: white;
            font-weight: bold;
          }
          .amount {
            font-weight: bold;
            color: #0891b2;
            font-size: 16px;
          }
          .terms-list {
            list-style-position: inside;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          .signature-line {
            margin-top: 40px;
            display: flex;
            justify-content: space-around;
          }
          .signature {
            width: 150px;
            text-align: center;
          }
          .signature-space {
            border-bottom: 1px solid #000;
            height: 50px;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DomHouse Real Estate</h1>
          <p>Property Sale Agreement & Payment Contract</p>
          <p style="color: #666; font-size: 12px;">Almaty, Kazakhstan</p>
        </div>

        <div class="contract-title">PROPERTY SALE AGREEMENT & PAYMENT CONTRACT</div>

        <div class="section">
          <h2>1. PROPERTY DETAILS</h2>
          <table>
            <tr>
              <td><strong>Property Title:</strong></td>
              <td>${property.title}</td>
            </tr>
            <tr>
              <td><strong>Location:</strong></td>
              <td>${property.location}</td>
            </tr>
            <tr>
              <td><strong>Property Type:</strong></td>
              <td>${property.type}</td>
            </tr>
            <tr>
              <td><strong>Bedrooms:</strong></td>
              <td>${property.beds}</td>
            </tr>
            <tr>
              <td><strong>Bathrooms:</strong></td>
              <td>${property.baths}</td>
            </tr>
            <tr>
              <td><strong>Area (sq.ft):</strong></td>
              <td>${property.sqft}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <h2>2. PAYMENT DETAILS</h2>
          <table>
            <tr>
              <th>Description</th>
              <th>Amount (₸)</th>
            </tr>
            <tr>
              <td>Property Sale Price</td>
              <td class="amount">₸${property.price.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Total Payment</strong></td>
              <td class="amount">₸${property.price.toLocaleString()}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <h2>3. PAYMENT SCHEDULE</h2>
          <ul class="terms-list">
            <li>Оплата полной стоимости недвижимости производится до подписания акта приема-передачи.</li>
            <li>Платеж осуществляется банковским переводом или наличными.</li>
            <li>Передача права собственности осуществляется после полной оплаты.</li>
          </ul>
        </div>

        <div class="section">
          <h2>4. TERMS & CONDITIONS (SALE)</h2>
          <ul class="terms-list">
            ${saleTerms.map(term => `<li>${term}</li>`).join('')}
          </ul>
        </div>

        <!-- No house rules for sale contract -->

        <div class="section">
          <h2>5. DISPUTE RESOLUTION</h2>
          <p>Все споры и разногласия, возникающие из настоящего договора, разрешаются путем переговоров между сторонами. В случае невозможности урегулирования спора — в судебном порядке по законодательству Республики Казахстан.</p>
        </div>

        <div class="section">
          <h2>6. AGREEMENT ACKNOWLEDGMENT</h2>
          <p>Подписывая настоящий договор, стороны подтверждают, что ознакомлены со всеми условиями купли-продажи недвижимости и согласны с ними.</p>
        </div>

        <div class="signature-line">
          <div class="signature">
            <strong>Landlord / Agent</strong>
            <div class="signature-space"></div>
            <p>_________________</p>
            <p style="font-size: 11px; margin: 5px 0;">Date</p>
          </div>
          <div class="signature">
            <strong>Tenant</strong>
            <div class="signature-space"></div>
            <p>_________________</p>
            <p style="font-size: 11px; margin: 5px 0;">Date</p>
          </div>
        </div>

        <div class="footer">
          <p>This contract has been automatically generated by DomHouse Real Estate Platform</p>
          <p>For official use. All rights reserved © 2024 DomHouse</p>
          <p>Generated on: ${new Date().toLocaleDateString('en-KZ', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </body>
      </html>
    `;

    const opt = {
      margin: 10,
      filename: `DomHouse_Contract_${property.title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(contractContent).save();
  };

  const handleSaveContract = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    if (!tenantName || !tenantEmail || !tenantPhone) {
      alert('Please fill in all tenant information');
      return;
    }

    setIsLoading(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedPlanData.days);

      const contractData = {
        propertyId: property._id,
        propertyTitle: property.title,
        propertyAddress: property.address || property.location || property.title,
        tenantName,
        tenantEmail,
        tenantPhone,
        contractType: isRent ? 'rent' : 'sale',
        contractDays: selectedPlanData.days,
        monthlyPrice: Math.round(property.price),
        totalPrice: Math.round(totalPrice),
        securityDeposit: Math.round(property.price * 0.5),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: 'pending'
      };

      const response = await axios.post(
        `${Backendurl}/api/contracts/create`,
        contractData
      );

      if (response.data.success !== false) {
        alert('Contract saved successfully! You can now download the PDF.');
        // Trigger PDF download after saving
        handleDownloadContract();
        // Close modal after a short delay
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving contract:', error);
      alert('Error saving contract. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Payment Contract & Agreement
              </h2>
              <p className="text-blue-100 mt-1">{property.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Property Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-3">Property Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">{property.location}</p>
                </div>
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="font-semibold text-gray-900">{property.type}</p>
                </div>
                <div>
                  <p className="text-gray-600">Bedrooms</p>
                  <p className="font-semibold text-gray-900">{property.beds}</p>
                </div>
              </div>
            </div>

            {/* Plan Selection */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Select Contract Period</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {plans.map((plan) => (
                  <motion.button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPlan === plan.id
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">{plan.label}</span>
                      {selectedPlan === plan.id && (
                        <Check className="w-5 h-5 text-teal-600" />
                      )}
                    </div>
                    <p className="text-2xl font-bold text-teal-600 mb-2">
                      ₸{Math.round(plan.price).toLocaleString()}
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-teal-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Payment Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Rate:</span>
                  <span className="font-semibold">₸{monthlyPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{selectedPlanData?.label} ({selectedPlanData?.days} days):</span>
                  <span className="font-semibold">₸{Math.round(totalPrice).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Security Deposit (50%):</span>
                  <span className="font-semibold">₸{Math.round(monthlyPrice * 0.5).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total Amount Due:</span>
                  <span className="text-2xl font-bold text-teal-600">
                    ₸{Math.round(totalPrice + (monthlyPrice * 0.5)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-3">Key Terms & Conditions</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {livingRules.slice(0, 5).map((rule, idx) => (
                  <li key={idx} className="flex gap-2">
                    <Check className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-3 italic">
                Complete terms and conditions will be included in the PDF document
              </p>
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 mt-1 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">
                    Я ознакомлен(а) и согласен(на) со всеми условиями настоящего договора купли-продажи недвижимости.
                  </span>
                </label>
              </div>
            </div>

            {/* Tenant Information Form */}
            {agreedToTerms && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3"
              >
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Tenant Information
                </h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={tenantEmail}
                  onChange={(e) => setTenantEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={tenantPhone}
                  onChange={(e) => setTenantPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveContract}
                disabled={!agreedToTerms || !tenantName || !tenantEmail || !tenantPhone || isLoading}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                  agreedToTerms && tenantName && tenantEmail && tenantPhone && !isLoading
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Save & Download Contract
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentContract;
