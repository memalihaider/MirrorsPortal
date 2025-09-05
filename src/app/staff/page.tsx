

'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AccessWrapper from '@/components/AccessWrapper';
import {
  Users,
  UserPlus,
  Search,
  Building2,
  Phone,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  LogIn,
  LogOut,
  ListChecks,
} from 'lucide-react';
import {
  format,
  startOfDay,
  endOfDay,
  isSameDay,
  parse,
} from 'date-fns';

/* ----------------------------- Types ----------------------------- */

type AttendanceStatus = 'present' | 'absent';

interface StaffDoc {
  id: string;
  name: string;
  role?: string;
  phone?: string;
  branch?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AttendanceDoc {
  id: string;
  staffId: string;
  day: string; // 'yyyy-MM-dd'
  status: AttendanceStatus;
  checkIn?: string | null; // 'HH:mm'
  checkOut?: string | null; // 'HH:mm'
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BookingServiceLite {
  serviceName: string;
}

interface BookingDocLite {
  id: string;
  customerName: string;
  services: BookingServiceLite[];
  bookingDate: Date; // Firestore Timestamp -> Date
  bookingTime: string; // 'HH:mm'
  branch?: string;
  staffId?: string; // new schema
  staff?: string | null; // legacy name
}

/* --------------------------- Constants --------------------------- */

const BRANCH_OPTIONS = ['Al Bustan', 'Marina', 'TECOM', 'AL Muraqabat', 'IBN Batutta Mall'];

/* --------------------------- Helpers ----------------------------- */

function nowHHMM() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function toDisplayAMPM(hhmm: string) {
  if (!hhmm) return '';
  const [hStr, m] = hhmm.split(':');
  let h = Number(hStr);
  const suffix = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  if (h > 12) h = h - 12;
  return `${h}:${m} ${suffix}`;
}

/* ========================= Component ========================= */

export default function StaffManagementPage() {
  /* ---------------------------- State ---------------------------- */
  const [staff, setStaff] = useState<StaffDoc[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState<string>(() => format(new Date(), 'yyyy-MM-dd'));

  // Attendance for selected day -> quick map by staffId
  const [attendance, setAttendance] = useState<Record<string, AttendanceDoc>>({});

  // Today tasks (bookings) grouped by staffId
  const [bookingsToday, setBookingsToday] = useState<BookingDocLite[]>([]);

  // Modal state (Create/Edit Staff)
  const [openModal, setOpenModal] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formBranch, setFormBranch] = useState<string>('');
  const [formActive, setFormActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* -------------------- Realtime: Staff list -------------------- */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'staff'), (snap) => {
      const list: StaffDoc[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          name: data.name || '',
          role: data.role || '',
          phone: data.phone || '',
          branch: data.branch || '',
          active: data.active !== false,
          createdAt: data.createdAt?.toDate?.() || undefined,
          updatedAt: data.updatedAt?.toDate?.() || undefined,
        } as StaffDoc;
      });
      // Sort by name asc for predictable UI
      list.sort((a, b) => a.name.localeCompare(b.name));
      setStaff(list);
    });
    return () => unsub();
  }, []);

  /* ------------- Realtime: Attendance for selected day ---------- */
  useEffect(() => {
    const day = selectedDay; // 'yyyy-MM-dd'
    const q = query(collection(db, 'attendance'), where('day', '==', day));
    const unsub = onSnapshot(q, (snap) => {
      const map: Record<string, AttendanceDoc> = {};
      snap.forEach((d) => {
        const data = d.data() as any;
        const a: AttendanceDoc = {
          id: d.id,
          staffId: String(data.staffId),
          day: String(data.day),
          status: (data.status as AttendanceStatus) || 'present',
          checkIn: data.checkIn ?? null,
          checkOut: data.checkOut ?? null,
          notes: data.notes ?? null,
          createdAt: data.createdAt?.toDate?.() || undefined,
          updatedAt: data.updatedAt?.toDate?.() || undefined,
        };
        map[a.staffId] = a;
      });
      setAttendance(map);
    });
    return () => unsub();
  }, [selectedDay]);

  /* ------------- Realtime: Today's bookings (for tasks) ---------- */
  useEffect(() => {
    // Convert selectedDay to start/end
    const start = startOfDay(new Date(selectedDay + 'T00:00:00'));
    const end = endOfDay(new Date(selectedDay + 'T00:00:00'));
    const qBookings = query(
      collection(db, 'bookings'),
      where('bookingDate', '>=', Timestamp.fromDate(start)),
      where('bookingDate', '<=', Timestamp.fromDate(end))
    );
    const unsub = onSnapshot(qBookings, (snap) => {
      const list: BookingDocLite[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          customerName: data.customerName || '',
          services: (data.services || []).map((s: any) => ({ serviceName: s.serviceName || '' })),
          bookingDate: data.bookingDate?.toDate?.() || new Date(),
          bookingTime: data.bookingTime || '',
          branch: data.branch || '',
          staffId: data.staffId || undefined,
          staff: data.staff ?? null, // legacy name support
        } as BookingDocLite;
      });
      setBookingsToday(list);
    });
    return () => unsub();
  }, [selectedDay]);

  /* ----------------------------- Derived ----------------------------- */
  const staffFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.role || '').toLowerCase().includes(q) ||
        (s.branch || '').toLowerCase().includes(q) ||
        (s.phone || '').toLowerCase().includes(q)
    );
  }, [search, staff]);

  const presentCount = useMemo(() => Object.values(attendance).filter((a) => a.status === 'present').length, [attendance]);
  const absentCount = useMemo(() => Object.values(attendance).filter((a) => a.status === 'absent').length, [attendance]);

  // Build maps for tasks: by staffId and also by legacy staff name (to support old bookings)
  const staffIdByName = useMemo(() => {
    const map: Record<string, string> = {};
    staff.forEach((s) => {
      map[(s.name || '').toLowerCase()] = s.id;
    });
    return map;
  }, [staff]);

  const tasksRows = useMemo(() => {
    // Normalize each booking to a staffId
    const rows = bookingsToday.map((b) => {
      let sid = b.staffId;
      if (!sid && b.staff) {
        sid = staffIdByName[(b.staff || '').toLowerCase()];
      }
      return { ...b, _staffId: sid } as BookingDocLite & { _staffId?: string };
    });
    // Sort by time ascending
    rows.sort((a, b) => (a.bookingTime || '').localeCompare(b.bookingTime || ''));
    return rows;
  }, [bookingsToday, staffIdByName]);

  /* ------------------------- Staff CRUD ------------------------- */
  const resetForm = () => {
    setEditingStaffId(null);
    setFormName('');
    setFormRole('');
    setFormPhone('');
    setFormBranch('');
    setFormActive(true);
  };

  const openCreate = () => {
    resetForm();
    setOpenModal(true);
  };

  const openEdit = (s: StaffDoc) => {
    setEditingStaffId(s.id);
    setFormName(s.name || '');
    setFormRole(s.role || '');
    setFormPhone(s.phone || '');
    setFormBranch(s.branch || '');
    setFormActive(s.active !== false);
    setOpenModal(true);
  };

  const saveStaff = async () => {
    if (!formName.trim()) {
      alert('Name is required');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        name: formName.trim(),
        role: formRole.trim() || null,
        phone: formPhone.trim() || null,
        branch: formBranch || null,
        active: !!formActive,
        updatedAt: serverTimestamp(),
      } as any;

      if (editingStaffId) {
        await updateDoc(doc(db, 'staff', editingStaffId), payload);
      } else {
        await addDoc(collection(db, 'staff'), { ...payload, createdAt: serverTimestamp() });
      }
      setOpenModal(false);
      resetForm();
    } catch (e) {
      console.error('Error saving staff', e);
      alert('Failed to save staff');
    } finally {
      setSaving(false);
    }
  };

  const removeStaff = async (id: string) => {
    if (!confirm('Delete this staff member?')) return;
    try {
      setDeleting(true);
      await deleteDoc(doc(db, 'staff', id));
    } catch (e) {
      console.error('Error deleting staff', e);
      alert('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  /* --------------------- Attendance Actions --------------------- */
  const ensureAttendanceDoc = async (staffId: string): Promise<string> => {
    const a = attendance[staffId];
    if (a) return a.id;
    const newDoc = await addDoc(collection(db, 'attendance'), {
      staffId,
      day: selectedDay,
      status: 'present',
      checkIn: null,
      checkOut: null,
      notes: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return newDoc.id;
  };

  const markPresent = async (staffId: string) => {
    const id = attendance[staffId]?.id || (await ensureAttendanceDoc(staffId));
    await updateDoc(doc(db, 'attendance', id), { status: 'present', updatedAt: serverTimestamp() });
  };

  const markAbsent = async (staffId: string) => {
    const id = attendance[staffId]?.id || (await ensureAttendanceDoc(staffId));
    await updateDoc(doc(db, 'attendance', id), { status: 'absent', updatedAt: serverTimestamp() });
  };

  const setCheckIn = async (staffId: string) => {
    const id = attendance[staffId]?.id || (await ensureAttendanceDoc(staffId));
    await updateDoc(doc(db, 'attendance', id), { checkIn: nowHHMM(), updatedAt: serverTimestamp() });
  };

  const setCheckOut = async (staffId: string) => {
    const id = attendance[staffId]?.id || (await ensureAttendanceDoc(staffId));
    await updateDoc(doc(db, 'attendance', id), { checkOut: nowHHMM(), updatedAt: serverTimestamp() });
  };

  /* ------------------------------ Render ------------------------------ */
  return (
    <AccessWrapper>
    <div className="p-6">
      <div className="max-w-7xl mx-auto dark:text-white">
        {/* Header */}
        <div className="mb-8 flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-100">
              <Users className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
              <p className="text-gray-600 dark:text-white/80">Daily attendance • Today’s tasks • Realtime synced with Bookings</p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow"
          >
            <UserPlus className="w-4 h-4" /> Add Staff
          </button>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search staff by name, role, branch, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="date"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                title="Attendance day & Today’s tasks date"
              />
            </div>
            {/* <div className="flex items-center">
              <Building2 className="w-5 h-5 text-gray-500 mr-2" />
              <select
                className="w-full border rounded-md px-3 py-2"
                value={''}
                onChange={() => {}}
                disabled
                title="Global branch filter can be added later"
              >
                <option>All Branches</option>
              </select>
            </div> */}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Present Today</p>
                <p className="text-2xl font-bold text-gray-900">{presentCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <XCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Absent Today</p>
                <p className="text-2xl font-bold text-gray-900">{absentCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ListChecks className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tasks Today</p>
                <p className="text-2xl font-bold text-gray-900">{bookingsToday.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staffFiltered.map((s) => {
                  const a = attendance[s.id];
                  const status = a?.status || '-';
                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{s.name}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] ${s.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                            {s.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{s.role || '—'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />{s.phone || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Building2 className="w-4 h-4 mr-2 text-gray-400" />{s.branch || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${status === 'present' ? 'bg-green-100 text-green-800' : status === 'absent' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                            {status}
                          </span>
                          {a?.checkIn && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-700">
                              <LogIn className="w-3 h-3" /> {toDisplayAMPM(a.checkIn)}
                            </span>
                          )}
                          {a?.checkOut && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-700">
                              <LogOut className="w-3 h-3" /> {toDisplayAMPM(a.checkOut)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => markPresent(s.id)} className="text-emerald-700 hover:text-emerald-900" title="Mark present">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => markAbsent(s.id)} className="text-red-600 hover:text-red-800" title="Mark absent">
                            <XCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => setCheckIn(s.id)} className="text-blue-600 hover:text-blue-800" title="Check-in now">
                            <LogIn className="w-5 h-5" />
                          </button>
                          <button onClick={() => setCheckOut(s.id)} className="text-yellow-600 hover:text-yellow-800" title="Check-out now">
                            <LogOut className="w-5 h-5" />
                          </button>
                          <button onClick={() => openEdit(s)} className="text-gray-700 hover:text-gray-900" title="Edit">
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button onClick={() => removeStaff(s.id)} className="text-rose-600 hover:text-rose-800" title="Delete">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {staffFiltered.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No staff found</h3>
              <p className="mt-1 text-sm text-gray-500">Try another search or add new staff.</p>
            </div>
          )}
        </div>

        {/* Today\'s Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Today\'s Tasks</h2>
              <p className="text-sm text-gray-600">Auto-synced from bookings on {format(new Date(selectedDay + 'T00:00:00'), 'MMM dd, yyyy')}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasksRows.map((b) => {
                  const s = b._staffId ? staff.find((x) => x.id === b._staffId) : staff.find((x) => (x.name || '').toLowerCase() === (b.staff || '').toLowerCase());
                  return (
                    <tr key={b.id}>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" /> {toDisplayAMPM(b.bookingTime)}
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{s?.name || b.staff || '—'}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{b.customerName}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {(b.services || []).map((sv, i) => (
                          <span key={i} className="inline-block mr-1 mb-1 px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 text-xs border border-pink-100">
                            {sv.serviceName}
                          </span>
                        ))}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{b.branch || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {tasksRows.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks for this day</h3>
              <p className="mt-1 text-sm text-gray-500">Create a booking and assign a staff to see tasks here.</p>
            </div>
          )}
        </div>

        {/* ===================== CREATE / EDIT STAFF MODAL ===================== */}
        {openModal && (
          <div className="fixed inset-0 bg-gray-600/50 z-50 overflow-y-auto h-full w-full">
            <div className="relative top-10 mx-auto w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3">
              <div className="bg-white rounded-lg shadow-xl border">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold">{editingStaffId ? 'Edit Staff' : 'Add Staff'}</h3>
                  <button
                    onClick={() => {
                      setOpenModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                    title="Close"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        className="mt-1 w-full border rounded-md px-3 py-2"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Aimen"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <input
                        className="mt-1 w-full border rounded-md px-3 py-2"
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value)}
                        placeholder="e.g. Hair Stylist"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        className="mt-1 w-full border rounded-md px-3 py-2"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="e.g. 0300-1234567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Branch</label>
                      <select
                        className="mt-1 w-full border rounded-md px-3 py-2"
                        value={formBranch}
                        onChange={(e) => setFormBranch(e.target.value)}
                      >
                        <option value="">Select One</option>
                        {BRANCH_OPTIONS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="active" type="checkbox" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} />
                      <label htmlFor="active" className="text-sm text-gray-700">Active</label>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setOpenModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    disabled={saving || deleting}
                  >
                    Close
                  </button>
                  {editingStaffId && (
                    <button
                      onClick={() => editingStaffId && removeStaff(editingStaffId)}
                      className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 disabled:opacity-60"
                      disabled={saving || deleting}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={saveStaff}
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-60"
                    disabled={saving || deleting}
                  >
                    {saving ? (editingStaffId ? 'Updating...' : 'Saving...') : editingStaffId ? 'Update' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ===================== END MODAL ===================== */}
      </div>
    </div>
    </AccessWrapper>
  );
}
