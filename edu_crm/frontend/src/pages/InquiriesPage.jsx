import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  Filter,
  Globe,
  GraduationCap,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  UserPlus,
  X
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { usePermissions } from '../hooks/usePermissions.js';
import { getApiErrorMessage } from '../services/api.js';
import { inquiryApi, staffApi } from '../services/crmServices.js';
import { formatDateTime } from '../utils/formatters.js';

const STATUS_CONFIG = {
  New: { label: 'New', bg: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200' },
  Contacted: { label: 'Contacted', bg: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200' },
  'In Progress': { label: 'In Progress', bg: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200' },
  Converted: { label: 'Converted', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200' },
  Closed: { label: 'Closed', bg: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300' }
};

export default function InquiriesPage() {
  const { toast } = useToast();
  const perms = usePermissions();

  const [inquiries, setInquiries] = useState([]);
  const [counts, setCounts] = useState({ total: 0, new: 0, contacted: 0, in_progress: 0, converted: 0, closed: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1, totalRecords: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [counselors, setCounselors] = useState([]);

  // Detail Modal
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateCounselor, setUpdateCounselor] = useState('');
  const [counselorNotes, setCounselorNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  // Convert Modal
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [convertForm, setConvertForm] = useState({
    university_name: 'To Be Assigned',
    course_name: '',
    academic_year: '2026-2027',
    intake: '',
    destination_country: '',
    passport_number: '',
    passport_expiry_date: '2034-01-01'
  });
  const [converting, setConverting] = useState(false);

  // New Inquiry Modal (Manual entry by staff)
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    destination_country: '',
    program_of_interest: '',
    intake: 'Fall 2026',
    notes: '',
    heard_from: '',
    source: 'direct'
  });
  const [submittingNew, setSubmittingNew] = useState(false);

  // Load Counselors
  useEffect(() => {
    staffApi
      .counselors()
      .then((res) => setCounselors(res.data || []))
      .catch(() => {});
  }, []);

  const loadInquiries = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 20,
          search: debouncedSearch || undefined,
          status: statusFilter !== 'All' ? statusFilter : undefined,
          source: sourceFilter !== 'All' ? sourceFilter : undefined
        };
        const res = await inquiryApi.list(params);
        setInquiries(res.data || []);
        if (res.counts) setCounts(res.counts);
        if (res.pagination) setPagination(res.pagination);
      } catch (err) {
        toast.error(getApiErrorMessage(err, 'Failed to load inquiries'));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [debouncedSearch, statusFilter, sourceFilter, toast]
  );

  useEffect(() => {
    loadInquiries(1);
  }, [loadInquiries]);

  const handleOpenDetail = (inquiry) => {
    setSelectedInquiry(inquiry);
    setUpdateStatus(inquiry.status || 'New');
    setUpdateCounselor(inquiry.assigned_counselor_id || '');
    setCounselorNotes(inquiry.counselor_notes || '');
  };

  const handleSaveUpdate = async () => {
    if (!selectedInquiry) return;
    setUpdating(true);
    try {
      const payload = {
        status: updateStatus,
        assigned_counselor_id: updateCounselor || null,
        counselor_notes: counselorNotes
      };
      const res = await inquiryApi.update(selectedInquiry.id, payload);
      toast.success('Inquiry updated successfully');
      setSelectedInquiry(res.data);
      loadInquiries(pagination.page);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update inquiry'));
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenConvert = () => {
    if (!selectedInquiry) return;
    setConvertForm({
      university_name: 'To Be Assigned',
      course_name: selectedInquiry.program_of_interest || '',
      academic_year: '2026-2027',
      intake: selectedInquiry.intake || 'Fall 2026',
      destination_country: selectedInquiry.destination_country || 'United Kingdom',
      passport_number: selectedInquiry.passport_id || '',
      passport_expiry_date: '2034-01-01'
    });
    setConvertModalOpen(true);
  };

  const handleConfirmConvert = async () => {
    if (!selectedInquiry) return;
    setConverting(true);
    try {
      const res = await inquiryApi.convert(selectedInquiry.id, convertForm);
      toast.success(
        `Converted to Student profile! Code: ${res.data?.student?.student_code || 'Generated'}`
      );
      setConvertModalOpen(false);
      setSelectedInquiry(null);
      loadInquiries(pagination.page);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to convert inquiry'));
    } finally {
      setConverting(false);
    }
  };

  const handleDelete = async (inquiry) => {
    if (!window.confirm(`Are you sure you want to delete inquiry for "${inquiry.full_name}"?`)) {
      return;
    }
    try {
      await inquiryApi.remove(inquiry.id);
      toast.success('Inquiry deleted successfully');
      if (selectedInquiry?.id === inquiry.id) setSelectedInquiry(null);
      loadInquiries(pagination.page);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to delete inquiry'));
    }
  };

  const handleCreateNew = async (e) => {
    e.preventDefault();
    setSubmittingNew(true);
    try {
      await inquiryApi.create(newForm);
      toast.success('New inquiry recorded successfully');
      setNewModalOpen(false);
      setNewForm({
        full_name: '',
        email: '',
        phone: '',
        destination_country: '',
        program_of_interest: '',
        intake: 'Fall 2026',
        notes: '',
        source: 'direct'
      });
      loadInquiries(1);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to create inquiry'));
    } finally {
      setSubmittingNew(false);
    }
  };

  // Build direct WhatsApp URL for a lead
  const buildWhatsAppUrl = (phone, name) => {
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
    const msg = `Hello ${name}, thank you for contacting AVOMAX Global Consultancy regarding your study abroad plans. How can we assist you today?`;
    return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}` : '#';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-primary-600" />
            Inquiries & Prospective Leads
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time prospective inquiries submitted directly from the AVOMAX website and global channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setRefreshing(true);
              loadInquiries(pagination.page);
            }}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={() => setNewModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Record Lead
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setStatusFilter('All')}
          className={`p-4 rounded-xl border text-left transition ${
            statusFilter === 'All'
              ? 'border-primary-500 bg-primary-50/60 dark:bg-primary-900/20'
              : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400">Total Leads</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{counts.total || 0}</div>
        </button>

        <button
          onClick={() => setStatusFilter('New')}
          className={`p-4 rounded-xl border text-left transition relative overflow-hidden ${
            statusFilter === 'New'
              ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-900/30'
              : 'border-blue-200 bg-blue-50/30 dark:bg-gray-800 dark:border-gray-700 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-blue-600 dark:text-blue-400">New</span>
            {counts.new > 0 && (
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            )}
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">{counts.new || 0}</div>
        </button>

        <button
          onClick={() => setStatusFilter('Contacted')}
          className={`p-4 rounded-xl border text-left transition ${
            statusFilter === 'Contacted'
              ? 'border-purple-500 bg-purple-50/60 dark:bg-purple-900/20'
              : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-purple-300'
          }`}
        >
          <div className="text-xs uppercase font-medium text-purple-600 dark:text-purple-400">Contacted</div>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">{counts.contacted || 0}</div>
        </button>

        <button
          onClick={() => setStatusFilter('In Progress')}
          className={`p-4 rounded-xl border text-left transition ${
            statusFilter === 'In Progress'
              ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-900/20'
              : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-amber-300'
          }`}
        >
          <div className="text-xs uppercase font-medium text-amber-600 dark:text-amber-400">In Progress</div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">{counts.in_progress || 0}</div>
        </button>

        <button
          onClick={() => setStatusFilter('Converted')}
          className={`p-4 rounded-xl border text-left transition ${
            statusFilter === 'Converted'
              ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-900/20'
              : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-emerald-300'
          }`}
        >
          <div className="text-xs uppercase font-medium text-emerald-600 dark:text-emerald-400">Converted</div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{counts.converted || 0}</div>
        </button>

        <button
          onClick={() => setStatusFilter('Closed')}
          className={`p-4 rounded-xl border text-left transition ${
            statusFilter === 'Closed'
              ? 'border-gray-500 bg-gray-100 dark:bg-gray-700'
              : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400">Closed</div>
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 mt-1">{counts.closed || 0}</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by candidate name, email, phone, course, or destination..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress</option>
            <option value="Converted">Converted</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="All">All Sources</option>
            <option value="website">Website Form</option>
            <option value="contact_page">Contact Page</option>
            <option value="direct">Direct / Office</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : inquiries.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No inquiries found"
            description={
              search || statusFilter !== 'All'
                ? 'Try adjusting your search query or status filter.'
                : 'Prospective inquiries submitted via the website application form will instantly appear here.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Destination & Program</th>
                  <th className="px-6 py-4">Preferred Intake</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {inquiries.map((inq) => {
                  const statusStyle = STATUS_CONFIG[inq.status] || STATUS_CONFIG.New;
                  return (
                    <tr
                      key={inq.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-700/40 transition cursor-pointer"
                      onClick={() => handleOpenDetail(inq)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">{inq.full_name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            {inq.email}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {inq.phone}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-primary-500" />
                          {inq.destination_country || 'Any Destination'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {inq.program_of_interest || 'General Consultation'}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {inq.intake || 'Immediate / Next'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="capitalize text-xs font-medium text-gray-600 dark:text-gray-400">
                          {inq.source?.replace('_', ' ') || 'Website'}
                        </span>
                        {inq.heard_from && (
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 truncate max-w-[140px]" title={`Heard from: ${inq.heard_from}`}>
                            via {inq.heard_from}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle.bg}`}
                        >
                          {statusStyle.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                        {formatDateTime(inq.created_at)}
                      </td>

                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={buildWhatsAppUrl(inq.phone, inq.full_name)}
                            target="_blank"
                            rel="noreferrer"
                            title="Chat on WhatsApp"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => handleOpenDetail(inq)}
                            className="px-2.5 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Review
                          </button>

                          {perms.canManageStaff && (
                            <button
                              onClick={() => handleDelete(inq)}
                              title="Delete Lead"
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => loadInquiries(p)}
            />
          </div>
        )}
      </div>

      {/* Inquiry Detail Drawer / Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-primary-600">
                  Lead Details & Action
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {selectedInquiry.full_name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Quick Actions Header */}
              <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <a
                    href={buildWhatsAppUrl(selectedInquiry.phone, selectedInquiry.full_name)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-semibold hover:opacity-90 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>

                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold hover:bg-gray-300"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call
                  </a>

                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold hover:bg-gray-300"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </a>
                </div>

                {selectedInquiry.status === 'Converted' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Converted to Student
                  </span>
                ) : (
                  <button
                    onClick={handleOpenConvert}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:brightness-105 shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Convert to Student Profile
                  </button>
                )}
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-gray-400 font-medium">Email</div>
                  <div className="font-semibold text-gray-900 dark:text-white mt-0.5">{selectedInquiry.email}</div>
                </div>
                <div>
                  <div className="text-gray-400 font-medium">Phone</div>
                  <div className="font-semibold text-gray-900 dark:text-white mt-0.5">{selectedInquiry.phone}</div>
                </div>
                <div>
                  <div className="text-gray-400 font-medium">Destination</div>
                  <div className="font-semibold text-gray-900 dark:text-white mt-0.5">
                    {selectedInquiry.destination_country || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 font-medium">Program of Interest</div>
                  <div className="font-semibold text-gray-900 dark:text-white mt-0.5">
                    {selectedInquiry.program_of_interest || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 font-medium">Intake</div>
                  <div className="font-semibold text-gray-900 dark:text-white mt-0.5">{selectedInquiry.intake || '—'}</div>
                </div>
                <div>
                  <div className="text-gray-400 font-medium">Passport / ID</div>
                  <div className="font-semibold text-gray-900 dark:text-white mt-0.5">
                    {selectedInquiry.passport_id || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 font-medium">Date of Birth</div>
                  <div className="font-semibold text-gray-900 dark:text-white mt-0.5">
                    {selectedInquiry.date_of_birth || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 font-medium">Nationality</div>
                  <div className="font-semibold text-gray-900 dark:text-white mt-0.5">
                    {selectedInquiry.nationality || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 font-medium">High School</div>
                  <div className="font-semibold text-gray-900 dark:text-white mt-0.5">
                    {selectedInquiry.high_school || '—'}
                  </div>
                </div>
              </div>

              {/* Address & Notes */}
              {selectedInquiry.address && (
                <div className="bg-gray-50 dark:bg-gray-900/30 p-3 rounded-lg text-xs">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Address: </span>
                  <span className="text-gray-600 dark:text-gray-400">{selectedInquiry.address}</span>
                </div>
              )}

              {selectedInquiry.notes && (
                <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 p-3.5 rounded-lg text-xs">
                  <div className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
                    Applicant Notes & Requirements:
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedInquiry.notes}</div>
                </div>
              )}

              {selectedInquiry.heard_from && (
                <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 p-3.5 rounded-lg text-xs">
                  <div className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                    <span>📣</span> How They Heard About Us:
                  </div>
                  <div className="text-gray-800 dark:text-gray-200 font-medium">{selectedInquiry.heard_from}</div>
                </div>
              )}

              {/* Status & Counselor Assignment Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Counselor Management</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Lead Status
                    </label>
                    <select
                      value={updateStatus}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                      className="w-full text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-2 text-gray-900 dark:text-white"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Converted">Converted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Assign Counselor
                    </label>
                    <select
                      value={updateCounselor}
                      onChange={(e) => setUpdateCounselor(e.target.value)}
                      className="w-full text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-2 text-gray-900 dark:text-white"
                    >
                      <option value="">Unassigned</option>
                      {counselors.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.full_name} ({c.department || 'Counselor'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Internal Follow-up Notes
                  </label>
                  <textarea
                    rows={3}
                    value={counselorNotes}
                    onChange={(e) => setCounselorNotes(e.target.value)}
                    placeholder="Record notes on student preferences, conversation outcome, next steps..."
                    className="w-full text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
              >
                Close
              </button>
              <button
                onClick={handleSaveUpdate}
                disabled={updating}
                className="px-4 py-2 text-xs font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-sm transition disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convert to Student Profile Modal */}
      {convertModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Convert to Student Profile</h3>
                <p className="text-xs text-gray-500">
                  This will create an official Student record in the CRM with full admissions & visa tracking.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Destination University Name *
                </label>
                <input
                  type="text"
                  value={convertForm.university_name}
                  onChange={(e) => setConvertForm({ ...convertForm, university_name: e.target.value })}
                  placeholder="e.g. Oxford, GD Goenka University, etc."
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enrolled Course / Degree *
                </label>
                <input
                  type="text"
                  value={convertForm.course_name}
                  onChange={(e) => setConvertForm({ ...convertForm, course_name: e.target.value })}
                  placeholder="e.g. MBBS, Bachelor of Science, MBA"
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Destination Country
                  </label>
                  <input
                    type="text"
                    value={convertForm.destination_country}
                    onChange={(e) => setConvertForm({ ...convertForm, destination_country: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Intake</label>
                  <input
                    type="text"
                    value={convertForm.intake}
                    onChange={(e) => setConvertForm({ ...convertForm, intake: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Passport / ID Number
                  </label>
                  <input
                    type="text"
                    value={convertForm.passport_number}
                    onChange={(e) => setConvertForm({ ...convertForm, passport_number: e.target.value })}
                    placeholder="Passport or ZW ID"
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={convertForm.academic_year}
                    onChange={(e) => setConvertForm({ ...convertForm, academic_year: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setConvertModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConvert}
                disabled={converting}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition disabled:opacity-50"
              >
                {converting ? 'Creating Student Profile...' : 'Confirm & Create Student'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Record Lead Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary-600" />
                Record Offline / Direct Lead
              </h3>
              <button onClick={() => setNewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newForm.full_name}
                  onChange={(e) => setNewForm({ ...newForm, full_name: e.target.value })}
                  placeholder="e.g. Tanya Sibanda"
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    placeholder="tanya@gmail.com"
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    placeholder="+263 ..."
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Destination Country</label>
                  <input
                    type="text"
                    value={newForm.destination_country}
                    onChange={(e) => setNewForm({ ...newForm, destination_country: e.target.value })}
                    placeholder="e.g. UK, India, Malaysia"
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Program of Interest</label>
                  <input
                    type="text"
                    value={newForm.program_of_interest}
                    onChange={(e) => setNewForm({ ...newForm, program_of_interest: e.target.value })}
                    placeholder="e.g. Medicine, Business"
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Where did they hear about us?</label>
                <input
                  type="text"
                  value={newForm.heard_from}
                  onChange={(e) => setNewForm({ ...newForm, heard_from: e.target.value })}
                  placeholder="e.g. Instagram, Facebook, Friend referral, Expo..."
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Notes / Remarks</label>
                <textarea
                  rows={2}
                  value={newForm.notes}
                  onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
                  placeholder="Lead source, parent details, specific requests..."
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingNew}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-sm disabled:opacity-50"
                >
                  {submittingNew ? 'Saving...' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

