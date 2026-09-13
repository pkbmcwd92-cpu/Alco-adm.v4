import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  FileDown,
  AlertTriangle,
  CheckCircle2,
  Save,
  Layers,
  CalendarCheck,
} from 'lucide-react';
import {
  AcademicCalendar,
  CalendarDay,
  TimeAllocation,
  AcademicSetting,
  TeacherProfile,
  SchoolData,
  ATPData,
} from '../../types';
import { generateKalenderAkademik, generateAlokasiWaktu } from '../../services/documentEngine';
import { calculateAvailableJP } from '../../services/jpEngine';

interface TimePlanningManagerProps {
  school: SchoolData;
  profile: TeacherProfile;
  academicSetting: AcademicSetting;
  atp?: ATPData;
  calendar?: AcademicCalendar;
  calendarDays: CalendarDay[];
  timeAllocations: TimeAllocation[];
  onSaveCalendar: (calendar: AcademicCalendar, days: CalendarDay[]) => void;
  onSaveTimeAllocations: (allocations: TimeAllocation[]) => void;
}

export const TimePlanningManager: React.FC<TimePlanningManagerProps> = ({
  school,
  profile,
  academicSetting,
  atp,
  calendar,
  calendarDays,
  timeAllocations,
  onSaveCalendar,
  onSaveTimeAllocations,
}) => {
  // Calendar form state
  const [academicYear, setAcademicYear] = useState(calendar?.academicYear || academicSetting.academicYear || '2026/2027');
  const [semester, setSemester] = useState<'1' | '2'>(calendar?.semester || (academicSetting.semester as '1' | '2') || '1');
  const [startDate, setStartDate] = useState(calendar?.startDate || (semester === '1' ? '2026-07-13' : '2027-01-04'));
  const [endDate, setEndDate] = useState(calendar?.endDate || (semester === '1' ? '2026-12-18' : '2027-06-18'));
  const [schoolDaysPerWeek, setSchoolDaysPerWeek] = useState<number>(calendar?.schoolDaysPerWeek || 5);
  const [jpPerWeek, setJpPerWeek] = useState<number>(calendar?.jpPerWeek || Number(academicSetting.totalHoursPerWeek) || 4);

  // Calendar days / events
  const [days, setDays] = useState<CalendarDay[]>(calendarDays || []);
  const [newDayDate, setNewDayDate] = useState('');
  const [newDayStatus, setNewDayStatus] = useState<CalendarDay['status']>('holiday');
  const [newDayNotes, setNewDayNotes] = useState('');

  // Time allocations mapped to ATP items
  const [allocations, setAllocations] = useState<TimeAllocation[]>(timeAllocations || []);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Calculations
  const holidaysCount = days.filter((d) => d.status === 'holiday').length;
  const schoolEventsCount = days.filter((d) => d.status === 'schoolEvent').length;

  // Approximate weeks between start and end date
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const approximateWeeks = Math.max(1, Math.floor(totalDays / 7));
  const estimatedEffectiveWeeks = Math.max(16, Math.min(22, approximateWeeks - Math.ceil(holidaysCount / schoolDaysPerWeek)));
  // Calculation using JP Engine (Formula: JP per minggu × minggu efektif = JP tersedia)
  const availableJPResult = calculateAvailableJP(jpPerWeek, estimatedEffectiveWeeks, {
    semester,
    academicYear,
    level: academicSetting.level,
    grade: academicSetting.grade,
    subject: academicSetting.subject,
  });
  const totalAvailableJP = availableJPResult.availableJP;

  const totalATPJP = (atp?.items || []).reduce((acc, curr) => acc + (Number(curr.jp) || 0), 0);
  const jpDifference = totalAvailableJP - totalATPJP;

  const handleAddDay = () => {
    if (!newDayDate) return;
    const newDay: CalendarDay = {
      id: `day-${Date.now()}`,
      academicCalendarId: calendar?.id || 'cal-1',
      date: newDayDate,
      status: newDayStatus,
      notes: newDayNotes || (newDayStatus === 'holiday' ? 'Hari Libur' : 'Kegiatan Khusus'),
    };
    setDays((prev) => [...prev, newDay]);
    setNewDayDate('');
    setNewDayNotes('');
  };

  const handleRemoveDay = (id: string) => {
    setDays((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSaveCalendarConfig = () => {
    const updatedCalendar: AcademicCalendar = {
      id: calendar?.id || `cal-${Date.now()}`,
      academicSettingId: academicSetting.id,
      academicYear,
      semester,
      startDate,
      endDate,
      schoolDaysPerWeek,
      jpPerWeek,
      updatedAt: new Date().toISOString(),
    };
    onSaveCalendar(updatedCalendar, days);
    setSaveNotification('Pengaturan Kalender Akademik berhasil disimpan!');
    setTimeout(() => setSaveNotification(null), 3000);
  };

  const handleWeekChange = (atpItemId: string, tpId: string, week: number) => {
    setAllocations((prev) => {
      const existingIndex = prev.findIndex((a) => a.atpItemId === atpItemId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], weekNumber: week };
        return updated;
      } else {
        const newAlloc: TimeAllocation = {
          id: `alloc-${Date.now()}-${atpItemId}`,
          academicSettingId: academicSetting.id,
          atpItemId,
          tpId,
          weekNumber: week,
          jp: Number((atp?.items || []).find((i) => i.id === atpItemId)?.jp) || jpPerWeek,
        };
        return [...prev, newAlloc];
      }
    });
  };

  const handleSaveAllocations = () => {
    onSaveTimeAllocations(allocations);
    setSaveNotification('Pemetaan Alokasi Waktu Pembelajaran berhasil disimpan!');
    setTimeout(() => setSaveNotification(null), 3000);
  };

  const handleExportKalender = async () => {
    setIsExporting('kalender');
    try {
      await generateKalenderAkademik({
        school,
        profile,
        academicSetting,
        calendar: {
          id: calendar?.id || 'cal-1',
          academicSettingId: academicSetting.id,
          academicYear,
          semester,
          startDate,
          endDate,
          schoolDaysPerWeek,
          jpPerWeek,
          updatedAt: new Date().toISOString(),
        },
        calendarDays: days,
      });
    } catch (e: any) {
      alert(`Gagal mengekspor kalender: ${e.message}`);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportAlokasi = async () => {
    setIsExporting('alokasi');
    try {
      await generateAlokasiWaktu({
        school,
        profile,
        academicSetting,
        atp,
        calendar: {
          id: calendar?.id || 'cal-1',
          academicSettingId: academicSetting.id,
          academicYear,
          semester,
          startDate,
          endDate,
          schoolDaysPerWeek,
          jpPerWeek,
          updatedAt: new Date().toISOString(),
        },
        timeAllocations: allocations,
      });
    } catch (e: any) {
      alert(`Gagal mengekspor alokasi waktu: ${e.message}`);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="space-y-6" id="time-planning-container">
      {saveNotification && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium">{saveNotification}</p>
        </div>
      )}

      {/* Top Banner & Context Info */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 font-semibold text-xs tracking-wider uppercase">
              <Clock className="w-4 h-4" />
              <span>Modul Perencanaan Waktu Pembelajaran</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Kalender Akademik, Hari Efektif, & Alokasi Waktu
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Sinkronisasi jadwal belajar dengan Alur Tujuan Pembelajaran ({academicSetting.subject} - {academicSetting.grade})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-export-kalender"
              type="button"
              onClick={handleExportKalender}
              disabled={isExporting === 'kalender'}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
            >
              <FileDown className="w-4 h-4 text-indigo-600" />
              <span>{isExporting === 'kalender' ? 'Mengekspor...' : 'Ekspor Kalender (.docx)'}</span>
            </button>
            <button
              id="btn-export-alokasi"
              type="button"
              onClick={handleExportAlokasi}
              disabled={isExporting === 'alokasi'}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
            >
              <FileDown className="w-4 h-4 text-emerald-600" />
              <span>{isExporting === 'alokasi' ? 'Mengekspor...' : 'Ekspor Alokasi Waktu (.docx)'}</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <span className="text-xs font-medium text-slate-500 block">Perkiraan Pekan Efektif</span>
            <span className="text-2xl font-bold text-slate-800 mt-1 block">{estimatedEffectiveWeeks} Pekan</span>
            <span className="text-xs text-slate-400">Total rentang semester</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <span className="text-xs font-medium text-slate-500 block">Total JP Efektif Tersedia</span>
            <span className="text-2xl font-bold text-indigo-600 mt-1 block">{totalAvailableJP} JP</span>
            <span className="text-[11px] text-indigo-600/80 font-medium">
              {estimatedEffectiveWeeks} pekan &times; {jpPerWeek} JP/pekan
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <span className="text-xs font-medium text-slate-500 block">Total Jam Direncanakan (ATP)</span>
            <span className="text-2xl font-bold text-emerald-700 mt-1 block">{totalATPJP} JP</span>
            <span className="text-xs text-slate-400">Dari {atp?.items?.length || 0} Tujuan Pembelajaran</span>
          </div>

          <div className={`border rounded-xl p-4 ${jpDifference < 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <span className="text-xs font-medium text-slate-600 block">Status Selisih Alokasi</span>
            <span className={`text-xl font-bold mt-1 block ${jpDifference < 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {jpDifference === 0 ? 'Tepat Pas (0 JP)' : jpDifference > 0 ? `+${jpDifference} JP Cadangan` : `${jpDifference} JP Defisit`}
            </span>
            <span className="text-xs text-slate-500">
              {jpDifference < 0 ? 'Jam ATP melebihi waktu efektif' : 'Kapasitas waktu terpenuhi'}
            </span>
          </div>
        </div>

        {/* Warning if ATP JP exceeds available JP */}
        {jpDifference < 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-3 text-amber-800 text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Peringatan Alokasi Waktu: </span>
              Total Jam Pelajaran pada Alur Tujuan Pembelajaran ({totalATPJP} JP) melebihi estimasi Jam Pembelajaran Efektif ({totalAvailableJP} JP) sebanyak {Math.abs(jpDifference)} JP.
              Pertimbangkan untuk merampingkan materi atau memanfaatkan jam cadangan.
            </div>
          </div>
        )}
      </div>

      {/* Grid: Calendar Configuration & Days List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-base">Konfigurasi Kalender Semester</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tahun Ajaran</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="2026/2027"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as '1' | '2')}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value="1">Semester 1 (Ganjil)</option>
                  <option value="2">Semester 2 (Genap)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tanggal Mulai Semester</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tanggal Akhir Semester</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Hari Sekolah / Pekan</label>
                <select
                  value={schoolDaysPerWeek}
                  onChange={(e) => setSchoolDaysPerWeek(Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value={5}>5 Hari (Senin - Jumat)</option>
                  <option value={6}>6 Hari (Senin - Sabtu)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Beban JP / Pekan</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={jpPerWeek}
                  onChange={(e) => setJpPerWeek(Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              id="btn-save-calendar-config"
              type="button"
              onClick={handleSaveCalendarConfig}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Konfigurasi Kalender</span>
            </button>
          </div>
        </div>

        {/* Right: Days & Special Events Manager */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-base">Agenda Libur & Kegiatan Khusus</h3>
            </div>
            <span className="text-xs text-slate-500">{days.length} entri tercatat</span>
          </div>

          {/* Add Day Input */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4 space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">Tambah Tanggal Libur / Kegiatan Sekolah:</span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="date"
                value={newDayDate}
                onChange={(e) => setNewDayDate(e.target.value)}
                className="sm:col-span-4 text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
              />
              <select
                value={newDayStatus}
                onChange={(e) => setNewDayStatus(e.target.value as CalendarDay['status'])}
                className="sm:col-span-3 text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
              >
                <option value="holiday">Hari Libur</option>
                <option value="schoolEvent">Kegiatan Sekolah</option>
                <option value="effective">Hari Efektif</option>
              </select>
              <input
                type="text"
                value={newDayNotes}
                onChange={(e) => setNewDayNotes(e.target.value)}
                placeholder="Keterangan (cth: PTS / Libur Nasional)"
                className="sm:col-span-4 text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
              />
              <button
                type="button"
                onClick={handleAddDay}
                className="sm:col-span-1 inline-flex items-center justify-center p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                title="Tambah"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days Table List */}
          <div className="overflow-x-auto max-h-64 overflow-y-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 sticky top-0 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Tanggal</th>
                  <th className="py-2 px-3">Jenis</th>
                  <th className="py-2 px-3">Keterangan</th>
                  <th className="py-2 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {days.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      Belum ada tanggal libur atau kegiatan khusus ditambahkan.
                    </td>
                  </tr>
                ) : (
                  days.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium text-slate-800">{d.date}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            d.status === 'holiday'
                              ? 'bg-rose-100 text-rose-700'
                              : d.status === 'schoolEvent'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {d.status === 'holiday' ? 'Libur' : d.status === 'schoolEvent' ? 'Kegiatan' : 'Efektif'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-600">{d.notes || '-'}</td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveDay(d.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom: Weekly Time Allocations mapped to ATP */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-slate-800 text-base">Pemetaan Pekan Pembelajaran per TP (ATP)</h3>
              <p className="text-xs text-slate-500">Tentukan distribusi pekan mengajar untuk masing-masing Tujuan Pembelajaran</p>
            </div>
          </div>

          <button
            id="btn-save-time-allocations"
            type="button"
            onClick={handleSaveAllocations}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pemetaan Waktu</span>
          </button>
        </div>

        {!atp?.items || atp.items.length === 0 ? (
          <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <p className="text-sm">Belum ada Alur Tujuan Pembelajaran (ATP) yang dibuat pada Step 05.</p>
            <p className="text-xs text-slate-400 mt-1">Silakan susun ATP terlebih dahulu agar materi otomatis terhubung di sini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">No</th>
                  <th className="py-2.5 px-3 w-28">Kode TP</th>
                  <th className="py-2.5 px-3">Tujuan Pembelajaran & Ruang Lingkup Materi</th>
                  <th className="py-2.5 px-3 w-24 text-center">Beban JP</th>
                  <th className="py-2.5 px-3 w-40 text-center">Penempatan Pekan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(atp.items || []).map((item, index) => {
                  const matchedAlloc = allocations.find((a) => a.atpItemId === item.id);
                  const defaultWeek = Math.min(estimatedEffectiveWeeks, index + 1);
                  const currentWeek = matchedAlloc?.weekNumber || defaultWeek;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 text-center font-medium text-slate-500">{index + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-indigo-700">{item.tpCode || `TP.${index + 1}`}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-800">{item.tpStatement || item.competency}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Lingkup Materi: {item.contentScope || item.subMaterial || '-'}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-slate-700">{item.jp || jpPerWeek} JP</td>
                      <td className="py-2.5 px-3 text-center">
                        <select
                          value={currentWeek}
                          onChange={(e) => handleWeekChange(item.id, item.tpId || item.id, Number(e.target.value))}
                          className="text-xs px-2 py-1.5 border border-slate-300 rounded bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                          {Array.from({ length: estimatedEffectiveWeeks }, (_, i) => i + 1).map((w) => (
                            <option key={w} value={w}>
                              Pekan ke-{w}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
