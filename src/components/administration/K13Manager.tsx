import React, { useState } from 'react';
import {
  BookOpen,
  Calculator,
  Plus,
  Trash2,
  FileDown,
  Save,
  CheckCircle2,
  Info,
} from 'lucide-react';
import {
  K13Analysis,
  K13AnalysisItem,
  K13KKM,
  K13KKMItem,
  AcademicSetting,
  TeacherProfile,
  SchoolData,
} from '../../types';
import { generateAnalisisK13, generatePenetapanKKM } from '../../services/documentEngine';

interface K13ManagerProps {
  school: SchoolData;
  profile: TeacherProfile;
  academicSetting: AcademicSetting;
  k13Analysis?: K13Analysis;
  k13KKM?: K13KKM;
  onSaveK13Analysis: (analysis: K13Analysis) => void;
  onSaveK13KKM: (kkm: K13KKM) => void;
}

export const K13Manager: React.FC<K13ManagerProps> = ({
  school,
  profile,
  academicSetting,
  k13Analysis,
  k13KKM,
  onSaveK13Analysis,
  onSaveK13KKM,
}) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'kkm'>('analysis');

  // SKL / KI / KD Analysis
  const [analysisItems, setAnalysisItems] = useState<K13AnalysisItem[]>(
    k13Analysis?.items || [
      {
        id: 'k13-item-1',
        skl: 'Memiliki perilaku yang mencerminkan sikap beriman, berakhlak mulia, dan bertanggung jawab.',
        ki: 'KI-3 (Pengetahuan) & KI-4 (Keterampilan)',
        kd: '3.1 Memahami variasi gerak dasar lokomotor, non-lokomotor, dan manipulatif.',
        indikator: '3.1.1 Menjelaskan konsep pola gerak dasar secara tepat.',
        materi: 'Gerak dasar lari, lompat, dan lempar.',
        kegiatan: 'Praktik dan penugasan kelompok pengamatan gerak.',
      },
    ]
  );

  // KKM Items
  const [kkmItems, setKkmItems] = useState<K13KKMItem[]>(
    k13KKM?.items || [
      {
        id: 'kkm-1',
        kd: '3.1 Memahami variasi gerak dasar lokomotor',
        indikator: 'Menjelaskan pola koordinasi gerak langkah kaki dan ayunan lengan',
        kompleksitas: 75,
        dayaDukung: 78,
        intake: 74,
        kkmIndikator: 76,
      },
      {
        id: 'kkm-2',
        kd: '4.1 Mempraktikkan variasi gerak dasar lokomotor',
        indikator: 'Melakukan gerak lari dan lompat melewati rintangan secara terarah',
        kompleksitas: 74,
        dayaDukung: 80,
        intake: 76,
        kkmIndikator: 77,
      },
    ]
  );

  // New Analysis Item state
  const [newSkl, setNewSkl] = useState('Standar Kompetensi Lulusan (Sikap, Pengetahuan, Keterampilan)');
  const [newKi, setNewKi] = useState('KI-3 (Pengetahuan) & KI-4 (Keterampilan)');
  const [newKd, setNewKd] = useState('');
  const [newIndikator, setNewIndikator] = useState('');
  const [newMateri, setNewMateri] = useState('');
  const [newKegiatan, setNewKegiatan] = useState('');

  // New KKM Item state
  const [newKkmKd, setNewKkmKd] = useState('');
  const [newKkmIndikator, setNewKkmIndikator] = useState('');
  const [newKompleksitas, setNewKompleksitas] = useState(75);
  const [newDayaDukung, setNewDayaDukung] = useState(78);
  const [newIntake, setNewIntake] = useState(74);

  const [notification, setNotification] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  // Total KKM calculation
  const totalKKM =
    kkmItems.length > 0
      ? Math.round(kkmItems.reduce((acc, curr) => acc + curr.kkmIndikator, 0) / kkmItems.length)
      : 75;

  const handleAddAnalysis = () => {
    if (!newKd.trim()) return;
    const newItem: K13AnalysisItem = {
      id: `item-${Date.now()}`,
      skl: newSkl,
      ki: newKi,
      kd: newKd,
      indikator: newIndikator,
      materi: newMateri,
      kegiatan: newKegiatan,
      penilaian: 'Tes Tertulis & Penilaian Kinerja',
    };
    const updated = [...analysisItems, newItem];
    setAnalysisItems(updated);
    onSaveK13Analysis({
      id: k13Analysis?.id || `k13-ana-${Date.now()}`,
      academicSettingId: academicSetting.id,
      items: updated,
      updatedAt: new Date().toISOString(),
    });
    setNewKd('');
    setNewIndikator('');
    setNewMateri('');
    setNewKegiatan('');
    setNotification('Analisis SKL/KI/KD berhasil ditambahkan!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteAnalysis = (id: string) => {
    const updated = analysisItems.filter((i) => i.id !== id);
    setAnalysisItems(updated);
    onSaveK13Analysis({
      id: k13Analysis?.id || `k13-ana-${Date.now()}`,
      academicSettingId: academicSetting.id,
      items: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddKKM = () => {
    if (!newKkmKd.trim()) return;
    const kkmVal = Math.round((newKompleksitas + newDayaDukung + newIntake) / 3);
    const newItem: K13KKMItem = {
      id: `kkm-${Date.now()}`,
      kd: newKkmKd,
      indikator: newKkmIndikator || 'Pencapaian kompetensi inti',
      kompleksitas: newKompleksitas,
      dayaDukung: newDayaDukung,
      intake: newIntake,
      kkmIndikator: kkmVal,
    };
    const updated = [...kkmItems, newItem];
    setKkmItems(updated);
    const avg = Math.round(updated.reduce((a, b) => a + b.kkmIndikator, 0) / updated.length);
    onSaveK13KKM({
      id: k13KKM?.id || `k13-kkm-${Date.now()}`,
      academicSettingId: academicSetting.id,
      kkmTotal: avg,
      items: updated,
      updatedAt: new Date().toISOString(),
    });
    setNewKkmKd('');
    setNewKkmIndikator('');
    setNotification('Indikator KKM berhasil ditambahkan!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteKKM = (id: string) => {
    const updated = kkmItems.filter((i) => i.id !== id);
    setKkmItems(updated);
    const avg =
      updated.length > 0
        ? Math.round(updated.reduce((a, b) => a + b.kkmIndikator, 0) / updated.length)
        : 75;
    onSaveK13KKM({
      id: k13KKM?.id || `k13-kkm-${Date.now()}`,
      academicSettingId: academicSetting.id,
      kkmTotal: avg,
      items: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleExportAnalysis = async () => {
    setIsExporting('analysis');
    try {
      await generateAnalisisK13({
        school,
        profile,
        academicSetting,
        k13Analysis: {
          id: k13Analysis?.id || 'k13-1',
          academicSettingId: academicSetting.id,
          items: analysisItems,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (e: any) {
      alert(`Gagal mengekspor Analisis K13: ${e.message}`);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportKKM = async () => {
    setIsExporting('kkm');
    try {
      await generatePenetapanKKM({
        school,
        profile,
        academicSetting,
        k13KKM: {
          id: k13KKM?.id || 'kkm-1',
          academicSettingId: academicSetting.id,
          kkmTotal: totalKKM,
          items: kkmItems,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (e: any) {
      alert(`Gagal mengekspor KKM: ${e.message}`);
    } finally {
      setIsExporting(null);
    }
  };

  const isK13 = academicSetting.curriculum === 'Kurikulum 2013';

  return (
    <div className="space-y-6" id="k13-manager-container">
      {notification && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium">{notification}</p>
        </div>
      )}

      {/* Curriculum status info */}
      {!isK13 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-blue-900 text-xs">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Informasi Kurikulum: </span>
            Saat ini rombel Anda diset menggunakan <strong>{academicSetting.curriculum}</strong>. Modul K13 ini tetap dapat Anda gunakan dan ekspor apabila satuan pendidikan Anda membutuhkan format administrasi Analisis SKL/KI/KD atau penetapan KKM K13.
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 font-semibold text-xs tracking-wider uppercase">
              <BookOpen className="w-4 h-4" />
              <span>Modul Khusus Kurikulum 2013 (K13)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Analisis SKL/KI/KD & Penetapan KKM</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Kelola telaah keterkaitan kompetensi dan kriteria ketuntasan minimal ({academicSetting.subject} - {academicSetting.grade})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-export-analisis-k13"
              type="button"
              onClick={handleExportAnalysis}
              disabled={isExporting === 'analysis'}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
            >
              <FileDown className="w-4 h-4 text-indigo-600" />
              <span>{isExporting === 'analysis' ? 'Mengekspor...' : 'Ekspor Analisis SKL/KI/KD (.docx)'}</span>
            </button>
            <button
              id="btn-export-kkm-k13"
              type="button"
              onClick={handleExportKKM}
              disabled={isExporting === 'kkm'}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
            >
              <FileDown className="w-4 h-4 text-emerald-600" />
              <span>{isExporting === 'kkm' ? 'Mengekspor...' : 'Ekspor Penetapan KKM (.docx)'}</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mt-5 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'analysis'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Analisis SKL, KI, dan KD ({analysisItems.length} Entri)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kkm')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'kkm'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Penetapan KKM Satuan Pendidikan (KKM: {totalKKM})
          </button>
        </div>
      </div>

      {/* Tab 1: Analysis SKL/KI/KD */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {/* Add form */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Tambah Butir Analisis SKL / KI / KD
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Standar Kompetensi Lulusan (SKL)</label>
                <input
                  type="text"
                  value={newSkl}
                  onChange={(e) => setNewSkl(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Kompetensi Inti (KI)</label>
                <input
                  type="text"
                  value={newKi}
                  onChange={(e) => setNewKi(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Kompetensi Dasar (KD)</label>
                <input
                  type="text"
                  value={newKd}
                  onChange={(e) => setNewKd(e.target.value)}
                  placeholder="Cth: 3.1 Memahami variasi pola gerak dasar"
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Indikator Pencapaian (IPK)</label>
                <input
                  type="text"
                  value={newIndikator}
                  onChange={(e) => setNewIndikator(e.target.value)}
                  placeholder="Cth: 3.1.1 Menjelaskan konsep gerak secara runtut"
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Materi Pokok</label>
                <input
                  type="text"
                  value={newMateri}
                  onChange={(e) => setNewMateri(e.target.value)}
                  placeholder="Cth: Pola gerak dasar lokomotor"
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Kegiatan Pembelajaran</label>
                <input
                  type="text"
                  value={newKegiatan}
                  onChange={(e) => setNewKegiatan(e.target.value)}
                  placeholder="Cth: Eksplorasi gerak dan demonstrasi mandiri"
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="button"
                  onClick={handleAddAnalysis}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Tambah
                </button>
              </div>
            </div>
          </div>

          {/* List Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 text-base mb-4">Matriks Keterkaitan SKL, KI, dan KD</h3>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">No</th>
                    <th className="py-2.5 px-3 w-40">SKL & KI</th>
                    <th className="py-2.5 px-3 w-48">Kompetensi Dasar (KD)</th>
                    <th className="py-2.5 px-3">Indikator & Rencana Pembelajaran</th>
                    <th className="py-2.5 px-3 w-14 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analysisItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-center text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-800">{item.ki}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{item.skl}</div>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-indigo-900">{item.kd}</td>
                      <td className="py-2.5 px-3">
                        <div className="text-slate-800 font-medium">{item.indikator}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Materi: {item.materi || '-'} • Kegiatan: {item.kegiatan || '-'}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteAnalysis(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: KKM */}
      {activeTab === 'kkm' && (
        <div className="space-y-6">
          {/* Add form */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Hitung KKM Kompetensi Dasar (KD)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Kompetensi Dasar (KD)</label>
                <input
                  type="text"
                  value={newKkmKd}
                  onChange={(e) => setNewKkmKd(e.target.value)}
                  placeholder="Cth: 3.1 Gerak Dasar"
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Indikator</label>
                <input
                  type="text"
                  value={newKkmIndikator}
                  onChange={(e) => setNewKkmIndikator(e.target.value)}
                  placeholder="Cth: Menjelaskan variasi langkah"
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Komp.</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={newKompleksitas}
                  onChange={(e) => setNewKompleksitas(Number(e.target.value))}
                  className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white text-center font-bold"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Daya Dk.</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={newDayaDukung}
                  onChange={(e) => setNewDayaDukung(Number(e.target.value))}
                  className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white text-center font-bold"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Intake</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={newIntake}
                  onChange={(e) => setNewIntake(Number(e.target.value))}
                  className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white text-center font-bold"
                />
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="button"
                  onClick={handleAddKKM}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  <Calculator className="w-4 h-4" /> Hitung & Tambah
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-base">Rincian Perhitungan KKM per Indikator</h3>
              <div className="bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-800">
                KKM Total Mapel: {totalKKM}
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">No</th>
                    <th className="py-2.5 px-3">Kompetensi Dasar & Indikator</th>
                    <th className="py-2.5 px-3 w-28 text-center">Kompleksitas</th>
                    <th className="py-2.5 px-3 w-28 text-center">Daya Dukung</th>
                    <th className="py-2.5 px-3 w-28 text-center">Intake Siswa</th>
                    <th className="py-2.5 px-3 w-28 text-center font-bold text-indigo-900 bg-indigo-50/50">KKM KD</th>
                    <th className="py-2.5 px-3 w-14 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kkmItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-center text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-800">{item.kd}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.indikator}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-700">{item.kompleksitas}</td>
                      <td className="py-2.5 px-3 text-center text-slate-700">{item.dayaDukung}</td>
                      <td className="py-2.5 px-3 text-center text-slate-700">{item.intake}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-indigo-700 bg-indigo-50/30">
                        {item.kkmIndikator}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteKKM(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
