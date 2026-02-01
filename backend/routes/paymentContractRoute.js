import express from 'express';
import {
  createPaymentContract,
  getContractsByProperty,
  getContractById,
  updateContractStatus,
  updatePaymentStatus,
  deleteContract,
  getAllContracts
} from '../controller/paymentContractController.js';

const router = express.Router();

// Admin - Get all contracts
router.get('/admin/all', getAllContracts);

// Create a new payment contract
router.post('/create', createPaymentContract);

// Get contracts for a specific property
router.get('/property/:propertyId', getContractsByProperty);

// Get a specific contract
router.get('/:contractId', getContractById);

// Update contract status
router.put('/:contractId/status', updateContractStatus);

// Update payment status
router.put('/:contractId/payment', updatePaymentStatus);

// Delete contract
router.delete('/:contractId', deleteContract);

export default router;
