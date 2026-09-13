import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  FileDown,
  Save,
  CheckCircle2,
  ListOrdered,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  AssessmentCriterion,
  AcademicSetting,
  TeacherProfile,
  SchoolData,
  TPData,
} from '../../types';
import { generateKKTP } from '../../services/documentEngine';

interface KKTPManagerProps {
  school: SchoolData;
  profile: TeacherProfile;
  academicSetting: AcademicSetting;
  tp?: TPData;
  assessmentCriteria: AssessmentCriterion[];
  onSaveCriteria: (criteria: AssessmentCriterion[]) => void;
}

export const KKTPManager: React.FC<KKTPManagerProps> = ({
  school,
  profile,
  academicSetting,
  tp,
  assessmentCriteria,
  onSaveCriteria,
}) => {
  const [criteriaList, setCriteriaList] = useState<AssessmentCriterion[]>(assessmentCriteria || []);
  const [selectedTpId, setSelectedTpId] = useState<string>(tp?.items?.[0]?.id || '');
  const [approach, setApproach] = useState<'rubrik' | 'deskripsi' | 'skala_interval'>('rubrik');
  const [notification, setNotification] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Active item
  const activeTp = (tp?.items || []).find((t) => t.id === selectedTpId) || tp?.items?.[0];
  const activeCriterion = criteriaList.find((c) => c.tpId === activeTp?.id);

  // Indicators / Levels state
  const [indicators, setIndicators] = useState<string[]>(
    activeCriterion?.indicators || [
      'Menunjukkan pemahaman konsep inti secara tepat',
      'Menerapkan langkah kerja atau prosedur dengan mandiri',
      'Mengkomunikasikan hasil belajar secara terstruktur',
    ]
  );

  const [levels, setLevels] = useState(
    activeCriterion?.levels || [
      {
        level: 'Perlu Bimbingan',
        label: 'Perlu Bimbingan',
        description: 'Belum mampu memenuhi kriteria inti pembelajaran, memerlukan bimbingan intensif perorangan.',
        scoreRange: '0 - 65',
      },
      {
        level: 'Cukup',
        label: 'Cukup',
        description: 'Mampu memenuhi sebagian kriteria inti dengan bantuan berkala dari pendidik.',
        scoreRange: '66 - 74',
      },
      {
        level: 'Baik',
        label: 'Baik (Tuntas)',
        description: 'Mampu memenuhi seluruh kriteria ketercapaian secara tepat dan mandiri.',
        scoreRange: '75 - 84',
      },
      {
        level: 'Sangat Baik',
        label: 'Sangat Baik',
        description: 'Menguasai kompetensi melampaui kriteria, mampu bernalar kritis dan membantu rekan sebaya.',
        scoreRange: '85 - 100',
      },
    ]
  );

  const handleSelectTp = (tpId: string) => {
    setSelectedTpId(tpId);
    const found = criteriaList.find((c) => c.tpId === tpId);
    if (found) {
      setApproach(found.approach);
      if (found.indicators) setIndicators(found.indicators);
      if (found.levels) setLevels(found.levels);
    } else {
      // Set default for this TP
      const targetTp = (tp?.items || []).find((t) => t.id === tpId);
      const subject = academicSetting.subject;
      setIndicators([
        `Mampu memahami materi esensial mengenai ${targetTp?.contentScope || 'pokok bahasan'}`,
        `Mampu mempraktikkan kompetensi ${targetTp?.competency || 'tujuan pembelajaran'} secara mandiri`,
        `Mampu menyajikan simpulan atau evaluasi hasil belajar ${subject}`,
      ]);
    }
  };

  const handleGenerateAI = () => {
    if (!activeTp) return;
    const scope = activeTp.contentScope || activeTp.statement;
    const comp = activeTp.competency || 'materi';

    setIndicators([
      `Mengidentifikasi dan menjelaskan unsur inti: ${scope}`,
      `Mempraktikkan atau menganalisis ${comp} dalam situasi kontekstual`,
      `Menyelesaikan penugasan pemecahan masalah terkait ${scope} secara mandiri dan akurat`,
    ]);

    setLevels([
      {
        level: 'Perlu Bimbingan',
        label: 'Perlu Bimbingan',
        description: `Belum mampu menguasai konsep dasar ${scope}, masih membutuhkan pendampingan penuh.`,
        scoreRange: '0 - 65',
      },
      {
        level: 'Cukup',
        label: 'Cukup',
        description: `Mampu menjelaskan sebagian unsur ${scope}, namun masih ragu dalam penerapan ${comp}.`,
        scoreRange: '66 - 74',
      },
      {
        level: 'Baik',
        label: 'Baik (Tuntas)',
        description: `Mampu menguasai materi ${scope} dan mempraktikkan ${comp} secara mandiri dengan benar.`,
        scoreRange: '75 - 84',
      },
      {
        level: 'Sangat Baik',
        label: 'Sangat Baik',
        description: `Sangat terampil dan mahir dalam ${comp}, serta mampu memberikan gagasan kreatif terkait ${scope}.`,
        scoreRange: '85 - 100',
      },
    ]);

    setNotification('Rekomendasi KKTP berhasil digenerate berdasarkan rumusan TP!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveCurrent = () => {
    if (!activeTp) return;
    const newCriterion: AssessmentCriterion = {
      id: activeCriterion?.id || `kktp-${Date.now()}-${activeTp.id}`,
      academicSettingId: academicSetting.id,
      tpId: activeTp.id,
      description: `Kriteria Ketercapaian Tujuan Pembelajaran: ${activeTp.statement}`,
      approach,
      passingThreshold: 75,
      indicators,
      levels,
      updatedAt: new Date().toISOString(),
    };

    const updated = criteriaList.filter((c) => c.tpId !== activeTp.id).concat(newCriterion);
    setCriteriaList(updated);
    onSaveCriteria(updated);
    setNotification('Kriteria Ketercapaian (KKTP) berhasil disimpan!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await generateKKTP({
        school,
        profile,
        academicSetting,
        tp,
        assessmentCriteria: criteriaList,
      });
    } catch (e: any) {
      alert(`Gagal mengekspor KKTP: ${e.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6" id="kktp-manager-container">
      {notification && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium">{notification}</p>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 font-semibold text-xs tracking-wider uppercase">
              <Award className="w-4 h-4" />
              <span>Modul Kriteria Ketercapaian Pembelajaran</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">KKTP (Kriteria Ketercapaian Tujuan Pembelajaran)</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Penetapan standar tuntas belajar per Tujuan Pembelajaran ({academicSetting.subject} - {academicSetting.grade})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-export-kktp"
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
            >
              <FileDown className="w-4 h-4 text-indigo-600" />
              <span>{isExporting ? 'Mengekspor...' : 'Ekspor KKTP (.docx)'}</span>
            </button>
          </div>
        </div>

        {/* TP Selection Pill Bar */}
        <div className="mt-5">
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
            Pilih Tujuan Pembelajaran (TP):
          </label>
          <div className="flex flex-wrap gap-2">
            {(tp?.items || []).map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTp(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  (activeTp?.id || tp?.items?.[0]?.id) === item.id
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.code || `TP.${idx + 1}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active TP Detail & KKTP Setup */}
      {activeTp && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          {/* Active TP Banner */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-indigo-700">{activeTp.code || 'Tujuan Pembelajaran'}</span>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{activeTp.statement}</p>
              <p className="text-xs text-slate-600 mt-1">
                Lingkup Materi: <span className="font-medium text-slate-800">{activeTp.contentScope || '-'}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateAI}
              className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Rekomendasi KKTP AI</span>
            </button>
          </div>

          {/* Approach Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Pendekatan KKTP:</span>
            {(
              [
                { id: 'rubrik', label: '1. Rubrik Performa (4 Tingkatan)' },
                { id: 'deskripsi', label: '2. Deskripsi Kriteria' },
                { id: 'skala_interval', label: '3. Skala Interval Nilai' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setApproach(opt.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  approach === opt.id
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Render by approach */}
          {approach === 'rubrik' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Deskripsi Rubrik Per Kategori Ketercapaian
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {levels.map((lvl, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-800">{lvl.label}</span>
                      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        Rentang: {lvl.scoreRange}
                      </span>
                    </div>
                    <textarea
                      value={lvl.description}
                      onChange={(e) => {
                        const updated = [...levels];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setLevels(updated);
                      }}
                      rows={3}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {approach === 'deskripsi_kriteria' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Daftar Indikator Ketercapaian (Siswa dinyatakan TUNTAS jika seluruh kriteria terpenuhi)
                </h4>
                <button
                  type="button"
                  onClick={() => setIndicators([...indicators, 'Indikator kriteria baru'])}
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Indikator
                </button>
              </div>

              <div className="space-y-2">
                {indicators.map((ind, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-6 text-center">{idx + 1}.</span>
                    <input
                      type="text"
                      value={ind}
                      onChange={(e) => {
                        const updated = [...indicators];
                        updated[idx] = e.target.value;
                        setIndicators(updated);
                      }}
                      className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setIndicators(indicators.filter((_, i) => i !== idx))}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {approach === 'skala_interval' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-32">Interval Nilai</th>
                    <th className="py-2.5 px-3">Kategori Ketercapaian</th>
                    <th className="py-2.5 px-3">Tindak Lanjut Pembelajaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-rose-50/40">
                    <td className="py-2 px-3 font-bold text-rose-700">0 - 40%</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">Belum Mencapai Ketuntasan</td>
                    <td className="py-2 px-3 text-slate-600">Remedial di seluruh bagian dan materi pengulangan</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="py-2 px-3 font-bold text-amber-700">41 - 74%</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">Belum Mencapai Ketuntasan</td>
                    <td className="py-2 px-3 text-slate-600">Remedial di bagian indikator yang belum tuntas saja</td>
                  </tr>
                  <tr className="bg-emerald-50/40">
                    <td className="py-2 px-3 font-bold text-emerald-700">75 - 84%</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">Sudah Mencapai Ketuntasan (Tuntas)</td>
                    <td className="py-2 px-3 text-slate-600">Tidak perlu remedial, melanjutkan materi berikutnya</td>
                  </tr>
                  <tr className="bg-indigo-50/40">
                    <td className="py-2 px-3 font-bold text-indigo-700">85 - 100%</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">Sudah Mencapai Ketuntasan (Sangat Baik)</td>
                    <td className="py-2 px-3 text-slate-600">Perlu pengayaan atau tantangan kontekstual lebih lanjut</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Action Save Button */}
          <div className="pt-2">
            <button
              id="btn-save-kktp"
              type="button"
              onClick={handleSaveCurrent}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Kriteria KKTP untuk {activeTp.code || 'TP ini'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
