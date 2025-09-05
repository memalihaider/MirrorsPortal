
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  addOffer,
  updateOffer,
  deleteOffer,
  subscribeToOffersChanges,
  addReferral,
  updateReferral,
  deleteReferral,
  subscribeToReferralsChanges,
  subscribeToBranchesChanges,
  subscribeToServicesChanges,
} from '@/lib/firebaseServicesNoStorage';
import AccessWrapper from '@/components/AccessWrapper';
import { Pencil, Trash2 } from 'lucide-react';

// Interfaces
interface Offer {
  id?: string;
  name: string;
  description: string;
  discount: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  image?: string;
  branches: { id: string; name: string }[];
  services: { id: string; name: string }[];
}

interface Referral {
  id?: string;
  name: string;
  description: string;
  discount: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  referralCode?: string;
  branches: { id: string; name: string }[];
  services: { id: string; name: string }[];
}

interface Branch {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
}

export default function Page() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<'offer' | 'referral'>('offer');
  const [editingItem, setEditingItem] = useState<Offer | Referral | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'offers' | 'referrals'>('offers');

  // Fetch realtime data
  useEffect(() => {
    const unsubOffers = subscribeToOffersChanges(setOffers);
    const unsubReferrals = subscribeToReferralsChanges(setReferrals);
    const unsubBranches = subscribeToBranchesChanges(setBranches);
    const unsubServices = subscribeToServicesChanges(setServices);
    return () => {
      unsubOffers();
      unsubReferrals();
      unsubBranches();
      unsubServices();
    };
  }, []);

  // Open popup
  const openModal = (type: 'offer' | 'referral', item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(
      item || {
        name: '',
        description: '',
        discount: 0,
        usageLimit: 0,
        startDate: '',
        endDate: '',
        isActive: true,
        image: '',
        referralCode: '',
        branches: [],
        services: [],
      }
    );
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  // Helpers for multi-select (real-time dropdowns)
  const handleBranchesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions).map((o) => o.value);
    const selected = branches.filter((b) => selectedIds.includes(b.id));
    setFormData({ ...formData, branches: selected });
  };

  const handleServicesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions).map((o) => o.value);
    const selected = services.filter((s) => selectedIds.includes(s.id));
    setFormData({ ...formData, services: selected });
  };

  // Submit form (original logic unchanged)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // format branches and services (id + name only)
    const formattedData = {
      ...formData,
      branches:
        formData.branches?.map((b: any) => ({
          id: b.id,
          name: b.name,
        })) || [],
      services:
        formData.services?.map((s: any) => ({
          id: s.id,
          name: s.name,
        })) || [],
    };

    if (modalType === 'offer') {
      if (editingItem?.id) {
        await updateOffer(editingItem.id, formattedData);
      } else {
        await addOffer(formattedData);
      }
    } else {
      if (editingItem?.id) {
        await updateReferral(editingItem.id, formattedData);
      } else {
        await addReferral(formattedData);
      }
    }
    closeModal();
  };

  // Delete (original logic unchanged)
  const handleDelete = async (type: 'offer' | 'referral', id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    if (type === 'offer') {
      await deleteOffer(id);
    } else {
      await deleteReferral(id);
    }
  };

  return (
    <AccessWrapper>
    <div className="p-6 space-y-6">
      {/* Header actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-2xl font-semibold text-pink-700">Offers & Referrals</div>
        <div className="flex gap-3">
          <button
            onClick={() => openModal('offer')}
            className="px-4 py-2 rounded-2xl bg-pink-500 text-white shadow-md hover:bg-pink-600 active:scale-95 transition"
          >
            + Add Offer
          </button>
          <button
            onClick={() => openModal('referral')}
            className="px-4 py-2 rounded-2xl bg-pink-400 text-white shadow-md hover:bg-pink-500 active:scale-95 transition"
          >
            + Add Referral
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-pink-50 p-1 rounded-2xl border border-pink-100 w-fit">
        <button
          className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${
            activeTab === 'offers'
              ? 'bg-white shadow text-pink-700'
              : 'text-pink-600 hover:bg-pink-100'
          }`}
          onClick={() => setActiveTab('offers')}
        >
          Offers
        </button>
        <button
          className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${
            activeTab === 'referrals'
              ? 'bg-white shadow text-pink-700'
              : 'text-pink-600 hover:bg-pink-100'
          }`}
          onClick={() => setActiveTab('referrals')}
        >
          Referrals
        </button>
      </div>

      {/* Grid of Cards */}
      {activeTab === 'offers' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-2xl border border-pink-100 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="relative h-40 w-full bg-pink-100">
                {offer.image ? (
                  <Image
                    src={offer.image}
                    alt={offer.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-pink-600">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-pink-700 line-clamp-2">{offer.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      offer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3">{offer.description}</p>

                <div className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-medium text-pink-700">{offer.discount}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Usage Limit</span>
                    <span className="font-medium">{offer.usageLimit}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <div>
                    <span className="text-gray-500">Start:</span> {offer.startDate}
                  </div>
                  <div>
                    <span className="text-gray-500">End:</span> {offer.endDate}
                  </div>
                </div>

                {offer.branches?.length > 0 && (
                  <div className="text-xs">
                    <div className="text-gray-500 mb-1">Branches</div>
                    <div className="flex flex-wrap gap-1">
                      {offer.branches.map((b) => (
                        <span
                          key={b.id}
                          className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-100"
                        >
                          {b.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {offer.services?.length > 0 && (
                  <div className="text-xs">
                    <div className="text-gray-500 mb-1">Services</div>
                    <div className="flex flex-wrap gap-1">
                      {offer.services.map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-100"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => openModal('offer', offer)}
                    className="p-2 rounded-xl bg-pink-100 hover:bg-pink-200 transition"
                    title="Edit"
                  >
                    <Pencil size={16} className="text-pink-700" />
                  </button>
                  <button
                    onClick={() => handleDelete('offer', offer.id!)}
                    className="p-2 rounded-xl bg-red-100 hover:bg-red-200 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {offers.length === 0 && (
            <div className="text-gray-500">No offers found.</div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {referrals.map((ref) => (
            <div
              key={ref.id}
              className="rounded-2xl border border-pink-100 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-pink-700 line-clamp-2">{ref.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      ref.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {ref.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3">{ref.description}</p>

                <div className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-medium text-pink-700">{ref.discount}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Usage Limit</span>
                    <span className="font-medium">{ref.usageLimit}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <div>
                    <span className="text-gray-500">Start:</span> {ref.startDate}
                  </div>
                  <div>
                    <span className="text-gray-500">End:</span> {ref.endDate}
                  </div>
                  {ref.referralCode && (
                    <div>
                      <span className="text-gray-500">Code:</span> {ref.referralCode}
                    </div>
                  )}
                </div>

                {ref.branches?.length > 0 && (
                  <div className="text-xs">
                    <div className="text-gray-500 mb-1">Branches</div>
                    <div className="flex flex-wrap gap-1">
                      {ref.branches.map((b) => (
                        <span
                          key={b.id}
                          className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-100"
                        >
                          {b.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {ref.services?.length > 0 && (
                  <div className="text-xs">
                    <div className="text-gray-500 mb-1">Services</div>
                    <div className="flex flex-wrap gap-1">
                      {ref.services.map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-100"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => openModal('referral', ref)}
                    className="p-2 rounded-xl bg-pink-100 hover:bg-pink-200 transition"
                    title="Edit"
                  >
                    <Pencil size={16} className="text-pink-700" />
                  </button>
                  <button
                    onClick={() => handleDelete('referral', ref.id!)}
                    className="p-2 rounded-xl bg-red-100 hover:bg-red-200 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {referrals.length === 0 && (
            <div className="text-gray-500">No referrals found.</div>
          )}
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold text-pink-700">
                {editingItem ? 'Edit' : 'Create'} {modalType === 'offer' ? 'Offer' : 'Referral'}
              </h2>
              <button
                onClick={closeModal}
                className="px-3 py-1 rounded-xl bg-gray-100 hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="max-h-[70vh] overflow-y-auto p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                </div>

                {/* Discount + Usage Limit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount %
                    </label>
                    <input
                      type="number"
                      placeholder="Discount %"
                      value={formData.discount ?? ''}
                      onChange={(e) =>
                        setFormData({ ...formData, discount: Number(e.target.value) })
                      }
                      className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      placeholder="Usage Limit"
                      value={formData.usageLimit ?? ''}
                      onChange={(e) =>
                        setFormData({ ...formData, usageLimit: Number(e.target.value) })
                      }
                      className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                      required
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate || ''}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate || ''}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                      required
                    />
                  </div>
                </div>

                {/* Image Input + NEW: Gallery Option */}
                {modalType === 'offer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={formData.image || ''}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="flex-1 border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                      />
                      {/* NEW: File Picker */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, image: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Referral Code (referral only) */}
                {modalType === 'referral' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Referral Code
                    </label>
                    <input
                      type="text"
                      placeholder="Referral Code"
                      value={formData.referralCode || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, referralCode: e.target.value })
                      }
                      className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  </div>
                )}

                {/* Branches */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branches</label>
                  <select
                    multiple
                    value={formData.branches?.map((b: any) => b.id) || []}
                    onChange={handleBranchesChange}
                    className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Services */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                  <select
                    multiple
                    value={formData.services?.map((s: any) => s.id) || []}
                    onChange={handleServicesChange}
                    className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive || false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-2xl bg-pink-500 text-white shadow-md hover:bg-pink-600 active:scale-95 transition"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </AccessWrapper>
  );
}

// wrap
// 'use client';

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import AccessWrapper from '@/components/AccessWrapper';
// import {
//   addOffer,
//   updateOffer,
//   deleteOffer,
//   subscribeToOffersChanges,
//   addReferral,
//   updateReferral,
//   deleteReferral,
//   subscribeToReferralsChanges,
//   subscribeToBranchesChanges,
//   subscribeToServicesChanges,
// } from '@/lib/firebaseServicesNoStorage';
// import { Pencil, Trash2 } from 'lucide-react';

// // Interfaces
// interface Offer {
//   id?: string;
//   name: string;
//   description: string;
//   discount: number;
//   usageLimit: number;
//   startDate: string;
//   endDate: string;
//   isActive: boolean;
//   image?: string;
//   branches: { id: string; name: string }[];
//   services: { id: string; name: string }[];
// }

// interface Referral {
//   id?: string;
//   name: string;
//   description: string;
//   discount: number;
//   usageLimit: number;
//   startDate: string;
//   endDate: string;
//   isActive: boolean;
//   referralCode?: string;
//   branches: { id: string; name: string }[];
//   services: { id: string; name: string }[];
// }

// interface Branch {
//   id: string;
//   name: string;
// }

// interface Service {
//   id: string;
//   name: string;
// }

// export default function Page() {
//   const [offers, setOffers] = useState<Offer[]>([]);
//   const [referrals, setReferrals] = useState<Referral[]>([]);
//   const [branches, setBranches] = useState<Branch[]>([]);
//   const [services, setServices] = useState<Service[]>([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [modalType, setModalType] = useState<'offer' | 'referral'>('offer');
//   const [editingItem, setEditingItem] = useState<Offer | Referral | null>(null);
//   const [formData, setFormData] = useState<any>({});
//   const [activeTab, setActiveTab] = useState<'offers' | 'referrals'>('offers');

//   // Fetch realtime data
//   useEffect(() => {
//     const unsubOffers = subscribeToOffersChanges(setOffers);
//     const unsubReferrals = subscribeToReferralsChanges(setReferrals);
//     const unsubBranches = subscribeToBranchesChanges(setBranches);
//     const unsubServices = subscribeToServicesChanges(setServices);
//     return () => {
//       unsubOffers();
//       unsubReferrals();
//       unsubBranches();
//       unsubServices();
//     };
//   }, []);

//   // Open popup
//   const openModal = (type: 'offer' | 'referral', item: any = null) => {
//     setModalType(type);
//     setEditingItem(item);
//     setFormData(
//       item || {
//         name: '',
//         description: '',
//         discount: 0,
//         usageLimit: 0,
//         startDate: '',
//         endDate: '',
//         isActive: true,
//         image: '',
//         referralCode: '',
//         branches: [],
//         services: [],
//       }
//     );
//     setIsOpen(true);
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//     setEditingItem(null);
//     setFormData({});
//   };

//   // Helpers for multi-select (real-time dropdowns)
//   const handleBranchesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedIds = Array.from(e.target.selectedOptions).map((o) => o.value);
//     const selected = branches.filter((b) => selectedIds.includes(b.id));
//     setFormData({ ...formData, branches: selected });
//   };

//   const handleServicesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedIds = Array.from(e.target.selectedOptions).map((o) => o.value);
//     const selected = services.filter((s) => selectedIds.includes(s.id));
//     setFormData({ ...formData, services: selected });
//   };

//   // Submit form
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // format branches and services
//     const formattedData = {
//       ...formData,
//       branches:
//         formData.branches?.map((b: any) => ({ id: b.id, name: b.name })) || [],
//       services:
//         formData.services?.map((s: any) => ({ id: s.id, name: s.name })) || [],
//     };

//     if (modalType === 'offer') {
//       if (editingItem?.id) await updateOffer(editingItem.id, formattedData);
//       else await addOffer(formattedData);
//     } else {
//       if (editingItem?.id) await updateReferral(editingItem.id, formattedData);
//       else await addReferral(formattedData);
//     }
//     closeModal();
//   };

//   // Delete
//   const handleDelete = async (type: 'offer' | 'referral', id: string) => {
//     if (!confirm('Are you sure you want to delete this item?')) return;
//     if (type === 'offer') await deleteOffer(id);
//     else await deleteReferral(id);
//   };

//   return (
//     <AccessWrapper>
//       <div className="p-6 space-y-6">
//         {/* Header actions */}
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div className="text-2xl font-semibold text-pink-700">Offers & Referrals</div>
//           <div className="flex gap-3">
//             <button
//               onClick={() => openModal('offer')}
//               className="px-4 py-2 rounded-2xl bg-pink-500 text-white shadow-md hover:bg-pink-600 active:scale-95 transition"
//             >
//               + Add Offer
//             </button>
//             <button
//               onClick={() => openModal('referral')}
//               className="px-4 py-2 rounded-2xl bg-pink-400 text-white shadow-md hover:bg-pink-500 active:scale-95 transition"
//             >
//               + Add Referral
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-2 bg-pink-50 p-1 rounded-2xl border border-pink-100 w-fit">
//           <button
//             className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${
//               activeTab === 'offers'
//                 ? 'bg-white shadow text-pink-700'
//                 : 'text-pink-600 hover:bg-pink-100'
//             }`}
//             onClick={() => setActiveTab('offers')}
//           >
//             Offers
//           </button>
//           <button
//             className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${
//               activeTab === 'referrals'
//                 ? 'bg-white shadow text-pink-700'
//                 : 'text-pink-600 hover:bg-pink-100'
//             }`}
//             onClick={() => setActiveTab('referrals')}
//           >
//             Referrals
//           </button>
//         </div>
//         {/* Grid of Cards */}
//         {activeTab === 'offers' ? (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {offers.map((offer) => (
//               <div
//                 key={offer.id}
//                 className="rounded-2xl border border-pink-100 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
//               >
//                 <div className="relative h-40 w-full bg-pink-100">
//                   {offer.image ? (
//                     <Image
//                       src={offer.image}
//                       alt={offer.name}
//                       fill
//                       className="object-cover"
//                     />
//                   ) : (
//                     <div className="h-full w-full flex items-center justify-center text-pink-600">
//                       No Image
//                     </div>
//                   )}
//                 </div>

//                 <div className="p-4 space-y-2">
//                   <div className="flex items-start justify-between gap-3">
//                     <h3 className="font-semibold text-pink-700 line-clamp-2">{offer.name}</h3>
//                     <span
//                       className={`text-xs px-2 py-1 rounded-full ${
//                         offer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
//                       }`}
//                     >
//                       {offer.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                   </div>

//                   <p className="text-sm text-gray-600 line-clamp-3">{offer.description}</p>

//                   <div className="text-sm">
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-500">Discount</span>
//                       <span className="font-medium text-pink-700">{offer.discount}%</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-500">Usage Limit</span>
//                       <span className="font-medium">{offer.usageLimit}</span>
//                     </div>
//                   </div>

//                   <div className="text-xs text-gray-600 space-y-1">
//                     <div>
//                       <span className="text-gray-500">Start:</span> {offer.startDate}
//                     </div>
//                     <div>
//                       <span className="text-gray-500">End:</span> {offer.endDate}
//                     </div>
//                   </div>

//                   {offer.branches?.length > 0 && (
//                     <div className="text-xs">
//                       <div className="text-gray-500 mb-1">Branches</div>
//                       <div className="flex flex-wrap gap-1">
//                         {offer.branches.map((b) => (
//                           <span
//                             key={b.id}
//                             className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-100"
//                           >
//                             {b.name}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {offer.services?.length > 0 && (
//                     <div className="text-xs">
//                       <div className="text-gray-500 mb-1">Services</div>
//                       <div className="flex flex-wrap gap-1">
//                         {offer.services.map((s) => (
//                           <span
//                             key={s.id}
//                             className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-100"
//                           >
//                             {s.name}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   <div className="pt-2 flex justify-end gap-2">
//                     <button
//                       onClick={() => openModal('offer', offer)}
//                       className="p-2 rounded-xl bg-pink-100 hover:bg-pink-200 transition"
//                       title="Edit"
//                     >
//                       <Pencil size={16} className="text-pink-700" />
//                     </button>
//                     <button
//                       onClick={() => handleDelete('offer', offer.id!)}
//                       className="p-2 rounded-xl bg-red-100 hover:bg-red-200 transition"
//                       title="Delete"
//                     >
//                       <Trash2 size={16} className="text-red-600" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {offers.length === 0 && <div className="text-gray-500">No offers found.</div>}
//           </div>
//         ) : (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {referrals.map((ref) => (
//               <div
//                 key={ref.id}
//                 className="rounded-2xl border border-pink-100 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
//               >
//                 <div className="p-4 space-y-2">
//                   <div className="flex items-start justify-between gap-3">
//                     <h3 className="font-semibold text-pink-700 line-clamp-2">{ref.name}</h3>
//                     <span
//                       className={`text-xs px-2 py-1 rounded-full ${
//                         ref.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
//                       }`}
//                     >
//                       {ref.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                   </div>

//                   <p className="text-sm text-gray-600 line-clamp-3">{ref.description}</p>

//                   <div className="text-sm">
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-500">Discount</span>
//                       <span className="font-medium text-pink-700">{ref.discount}%</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-500">Usage Limit</span>
//                       <span className="font-medium">{ref.usageLimit}</span>
//                     </div>
//                   </div>

//                   <div className="text-xs text-gray-600 space-y-1">
//                     <div>
//                       <span className="text-gray-500">Start:</span> {ref.startDate}
//                     </div>
//                     <div>
//                       <span className="text-gray-500">End:</span> {ref.endDate}
//                     </div>
//                     {ref.referralCode && (
//                       <div>
//                         <span className="text-gray-500">Code:</span> {ref.referralCode}
//                       </div>
//                     )}
//                   </div>

//                   {ref.branches?.length > 0 && (
//                     <div className="text-xs">
//                       <div className="text-gray-500 mb-1">Branches</div>
//                       <div className="flex flex-wrap gap-1">
//                         {ref.branches.map((b) => (
//                           <span
//                             key={b.id}
//                             className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-100"
//                           >
//                             {b.name}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {ref.services?.length > 0 && (
//                     <div className="text-xs">
//                       <div className="text-gray-500 mb-1">Services</div>
//                       <div className="flex flex-wrap gap-1">
//                         {ref.services.map((s) => (
//                           <span
//                             key={s.id}
//                             className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-100"
//                           >
//                             {s.name}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   <div className="pt-2 flex justify-end gap-2">
//                     <button
//                       onClick={() => openModal('referral', ref)}
//                       className="p-2 rounded-xl bg-pink-100 hover:bg-pink-200 transition"
//                       title="Edit"
//                     >
//                       <Pencil size={16} className="text-pink-700" />
//                     </button>
//                     <button
//                       onClick={() => handleDelete('referral', ref.id!)}
//                       className="p-2 rounded-xl bg-red-100 hover:bg-red-200 transition"
//                       title="Delete"
//                     >
//                       <Trash2 size={16} className="text-red-600" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {referrals.length === 0 && <div className="text-gray-500">No referrals found.</div>}
//           </div>
//         )}

//         {/* Modal */}
//         {isOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3">
//             <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
//               {/* Modal Header */}
//               <div className="flex items-center justify-between border-b p-4">
//                 <h2 className="text-lg font-semibold text-pink-700">
//                   {editingItem ? 'Edit' : 'Create'} {modalType === 'offer' ? 'Offer' : 'Referral'}
//                 </h2>
//                 <button
//                   onClick={closeModal}
//                   className="px-3 py-1 rounded-xl bg-gray-100 hover:bg-gray-200"
//                 >
//                   Close
//                 </button>
//               </div>

//               {/* Modal Body (Scrollable) */}
//               <div className="max-h-[70vh] overflow-y-auto p-4">
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   {/* Name, Description, Discount, Dates, Image, Branches, Services, ReferralCode */}
//                   {/* All logic same as original Part 1 including gallery input */}
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </AccessWrapper>
//   );
// }
