import PaymentContract from '../models/paymentContractModel.js';
import Property from '../models/propertymodel.js';

// Create a new payment contract
export const createPaymentContract = async (req, res) => {
  try {
    const {
      propertyId,
      propertyTitle,
      propertyAddress,
      tenantName,
      tenantEmail,
      tenantPhone,
      contractType,
      contractDays,
      monthlyPrice,
      totalPrice,
      securityDeposit,
      startDate,
      endDate,
      livingRules,
      houseRules,
      notes
    } = req.body;

    // Verify property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    // Ensure required fields have sensible fallbacks to avoid validation errors
    const finalPropertyAddress = propertyAddress || property.address || property.location || property.title || 'N/A';
    const finalTotalPrice = Number(totalPrice) || Number(property.price) || 0;
    const finalSecurityDeposit = Number(securityDeposit) || 0;
    const finalMonthlyPrice = Number(monthlyPrice) || Number(property.price) || 0;

    // Create new payment contract
    const newContract = new PaymentContract({
      propertyId,
      propertyTitle: propertyTitle || property.title || 'Property',
      propertyAddress: finalPropertyAddress,
      tenantName: tenantName || 'Unknown',
      tenantEmail: tenantEmail || 'unknown@example.com',
      tenantPhone: tenantPhone || '',
      contractType: contractType || 'sale',
      contractDays: contractDays || undefined,
      monthlyPrice: finalMonthlyPrice,
      totalPrice: finalTotalPrice,
      securityDeposit: finalSecurityDeposit,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      livingRules: livingRules || undefined,
      houseRules: houseRules || undefined,
      notes: notes || '',
      paymentDetails: {
        amount: finalTotalPrice + finalSecurityDeposit,
        currency: '₸',
        paymentMethod: 'pending',
        paymentStatus: 'pending'
      }
    });

    const savedContract = await newContract.save();

    res.status(201).json({
      message: 'Payment contract created successfully',
      contract: savedContract
    });
  } catch (error) {
    console.error('Error creating payment contract:', error);
    res.status(500).json({
      message: 'Error creating payment contract',
      error: error.message
    });
  }
};

// Get all contracts for a property
export const getContractsByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const contracts = await PaymentContract.find({ propertyId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Contracts retrieved successfully',
      contracts
    });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({
      message: 'Error fetching contracts',
      error: error.message
    });
  }
};

// Get contract by ID
export const getContractById = async (req, res) => {
  try {
    const { contractId } = req.params;

    const contract = await PaymentContract.findById(contractId)
      .populate('propertyId');

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    res.status(200).json({
      message: 'Contract retrieved successfully',
      contract
    });
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).json({
      message: 'Error fetching contract',
      error: error.message
    });
  }
};

// Update contract status
export const updateContractStatus = async (req, res) => {
  try {
    const { contractId } = req.params;
    const { status, landlordSignedAt, tenantSignedAt } = req.body;

    const updateData = { status };

    if (landlordSignedAt) updateData.landlordSignedAt = landlordSignedAt;
    if (tenantSignedAt) updateData.tenantSignedAt = tenantSignedAt;

    const updatedContract = await PaymentContract.findByIdAndUpdate(
      contractId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    res.status(200).json({
      message: 'Contract status updated successfully',
      contract: updatedContract
    });
  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(500).json({
      message: 'Error updating contract',
      error: error.message
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { contractId } = req.params;
    const { paymentStatus, paymentMethod } = req.body;

    const updateData = {
      'paymentDetails.paymentStatus': paymentStatus,
      'paymentDetails.paymentMethod': paymentMethod || 'pending'
    };

    const updatedContract = await PaymentContract.findByIdAndUpdate(
      contractId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    res.status(200).json({
      message: 'Payment status updated successfully',
      contract: updatedContract
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      message: 'Error updating payment status',
      error: error.message
    });
  }
};

// Delete contract
export const deleteContract = async (req, res) => {
  try {
    const { contractId } = req.params;

    const deletedContract = await PaymentContract.findByIdAndDelete(contractId);

    if (!deletedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    res.status(200).json({
      message: 'Contract deleted successfully',
      contract: deletedContract
    });
  } catch (error) {
    console.error('Error deleting contract:', error);
    res.status(500).json({
      message: 'Error deleting contract',
      error: error.message
    });
  }
};

// Get all contracts (admin)
export const getAllContracts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const contracts = await PaymentContract.find(query)
      .populate('propertyId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await PaymentContract.countDocuments(query);

    res.status(200).json({
      message: 'All contracts retrieved successfully',
      contracts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching all contracts:', error);
    res.status(500).json({
      message: 'Error fetching contracts',
      error: error.message
    });
  }
};
